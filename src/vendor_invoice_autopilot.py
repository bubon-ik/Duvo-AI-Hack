from decimal import Decimal, InvalidOperation


class InvoiceAutopilot:
    REQUIRED_FIELDS = ("vendor_name", "invoice_number", "amount", "currency", "vat_rate")

    def __init__(self, vendors, purchase_orders, prior_invoice_numbers=None):
        self.vendors = {row["vendor_name"]: row for row in vendors}
        self.purchase_orders = {row["po_number"]: row for row in purchase_orders}
        self.prior_invoice_numbers = set(prior_invoice_numbers or [])

    def review(self, invoice):
        reasons = []
        risk_score = 0

        for field in self.REQUIRED_FIELDS:
            if not str(invoice.get(field, "")).strip():
                reasons.append(f"Missing required field: {field}")
                risk_score += 30

        vendor = self.vendors.get(invoice.get("vendor_name", ""))
        if invoice.get("vendor_name") and not vendor:
            reasons.append("Unknown vendor")
            risk_score += 35

        if invoice.get("invoice_number") in self.prior_invoice_numbers:
            reasons.append("Duplicate invoice number")
            risk_score += 100

        po_number = invoice.get("po_number", "").strip()
        purchase_order = None
        if not po_number:
            reasons.append("Missing PO number")
            risk_score += 45
        else:
            purchase_order = self.purchase_orders.get(po_number)
            if not purchase_order:
                reasons.append("PO number not found")
                risk_score += 70

        if vendor and po_number and not po_number.startswith(vendor["approved_po_prefix"]):
            reasons.append("PO prefix is not approved for this vendor")
            risk_score += 70

        if vendor and invoice.get("vat_rate"):
            if _decimal(invoice["vat_rate"]) != _decimal(vendor["expected_vat_rate"]):
                reasons.append("VAT rate does not match vendor policy")
                risk_score += 60

        if purchase_order:
            if invoice.get("vendor_name") and purchase_order["vendor_name"] != invoice.get("vendor_name"):
                reasons.append("PO belongs to a different vendor")
                risk_score += 90
            if purchase_order["currency"] != invoice.get("currency"):
                reasons.append("Currency does not match PO")
                risk_score += 60
            if purchase_order["delivery_status"] != "delivered":
                reasons.append("Delivery is not confirmed")
                risk_score += 70
            risk_score += self._amount_risk(invoice, purchase_order, reasons)

        status = self._status_for(reasons, risk_score)
        suggested_action = self._suggested_action(status)
        requires_human_approval = status != "approved" or self._is_high_value(invoice)
        case_state = "closed" if status == "approved" else "open"

        return {
            "vendor_name": invoice.get("vendor_name", ""),
            "invoice_number": invoice.get("invoice_number", ""),
            "po_number": po_number,
            "amount": invoice.get("amount", ""),
            "currency": invoice.get("currency", ""),
            "vat_rate": invoice.get("vat_rate", ""),
            "due_date": invoice.get("due_date", ""),
            "status": status,
            "risk_score": min(risk_score, 100),
            "reasons": reasons,
            "suggested_action": suggested_action,
            "requires_human_approval": requires_human_approval,
            "draft_email": self._draft_email(invoice, reasons) if status == "dispute" else "",
            "case_state": case_state,
            "resolution_notes": "",
        }

    def resolve_from_vendor_reply(self, reply, existing_review):
        invoice_number = reply.get("invoice_number", "")
        if invoice_number != existing_review.get("invoice_number", ""):
            return self._unresolved_reply(
                reply,
                existing_review,
                "Vendor reply does not match the open invoice case",
            )

        status = existing_review.get("status", "")
        if status == "dispute":
            return self._resolve_dispute(reply, existing_review)
        if status == "needs_review":
            return self._resolve_needs_review(reply, existing_review)

        return self._unresolved_reply(
            reply,
            existing_review,
            f"Invoice case is not open for resolution: {status}",
        )

    def _amount_risk(self, invoice, purchase_order, reasons):
        amount = _decimal(invoice.get("amount", ""))
        expected_amount = _decimal(purchase_order.get("expected_amount", ""))
        if amount is None or expected_amount is None:
            return 0

        difference = amount - expected_amount
        if difference <= Decimal("0"):
            return 0
        if difference <= Decimal("50.00"):
            reasons.append(f"Invoice is {difference} over the PO amount")
            return 30
        reasons.append(f"Invoice is {difference} over the PO amount")
        return 80

    def _is_high_value(self, invoice):
        amount = _decimal(invoice.get("amount", ""))
        return amount is not None and amount >= Decimal("5000.00")

    def _status_for(self, reasons, risk_score):
        dispute_reasons = {
            "Duplicate invoice number",
            "PO number not found",
            "PO prefix is not approved for this vendor",
            "PO belongs to a different vendor",
            "Currency does not match PO",
            "VAT rate does not match vendor policy",
            "Delivery is not confirmed",
        }
        if risk_score >= 70 or any(reason in dispute_reasons for reason in reasons):
            return "dispute"
        if reasons:
            return "needs_review"
        return "approved"

    def _suggested_action(self, status):
        if status == "approved":
            return "Mark ready for payment"
        if status == "needs_review":
            return "Ask AP owner for missing context"
        return "Send dispute email after approval"

    def _draft_email(self, invoice, reasons):
        reason_text = "; ".join(reasons)
        return (
            f"Subject: Invoice {invoice.get('invoice_number', '')} requires correction\n\n"
            f"Hi {invoice.get('vendor_name', 'team')},\n\n"
            "We reviewed your invoice and cannot approve it for payment yet.\n\n"
            f"Issues found: {reason_text}.\n\n"
            "Please send a corrected invoice or confirm the discrepancy so we can continue processing.\n\n"
            "Best,\nAP Operations"
        )

    def _resolve_dispute(self, reply, existing_review):
        po_number = reply.get("po_number") or existing_review.get("po_number", "")
        purchase_order = self.purchase_orders.get(po_number)
        corrected_amount = _decimal(reply.get("corrected_amount", ""))

        if not purchase_order:
            return self._unresolved_reply(reply, existing_review, "Referenced PO was not found")
        if corrected_amount is None:
            return self._unresolved_reply(reply, existing_review, "Reply did not include a corrected amount")
        if corrected_amount != _decimal(purchase_order.get("expected_amount", "")):
            return self._unresolved_reply(
                reply,
                existing_review,
                "Corrected amount still does not match the PO amount",
            )

        resolved = dict(existing_review)
        resolved["amount"] = reply.get("corrected_amount", existing_review.get("amount", ""))
        resolved.update(
            {
                "status": "resolved",
                "risk_score": 0,
                "reasons": [],
                "suggested_action": "Process corrected invoice for payment",
                "requires_human_approval": self._is_high_value(resolved),
                "draft_email": "",
                "case_state": "closed",
                "resolution_notes": (
                    f"Vendor corrected amount matches {po_number}; "
                    f"{reply.get('reply_summary', '').strip()}"
                ).strip(),
            }
        )
        return resolved

    def _resolve_needs_review(self, reply, existing_review):
        po_number = reply.get("confirmed_po_number") or reply.get("po_number", "")
        purchase_order = self.purchase_orders.get(po_number)

        if not purchase_order:
            return self._unresolved_reply(reply, existing_review, "Confirmed PO was not found")
        if purchase_order["vendor_name"] != existing_review.get("vendor_name"):
            return self._unresolved_reply(reply, existing_review, "Confirmed PO belongs to a different vendor")
        if purchase_order["currency"] != existing_review.get("currency"):
            return self._unresolved_reply(reply, existing_review, "Confirmed PO currency does not match")
        if _decimal(purchase_order["expected_amount"]) != _decimal(existing_review.get("amount", "")):
            return self._unresolved_reply(reply, existing_review, "Confirmed PO amount does not match")
        if purchase_order["delivery_status"] != "delivered":
            return self._unresolved_reply(reply, existing_review, "Confirmed PO delivery is not complete")

        resolved = dict(existing_review)
        resolved.update(
            {
                "po_number": po_number,
                "status": "approved",
                "risk_score": 0,
                "reasons": [],
                "suggested_action": "Mark ready for payment",
                "requires_human_approval": self._is_high_value(resolved),
                "draft_email": "",
                "case_state": "closed",
                "resolution_notes": (
                    f"Vendor confirmed PO matches {po_number}; "
                    f"{reply.get('reply_summary', '').strip()}"
                ).strip(),
            }
        )
        return resolved

    def _unresolved_reply(self, reply, existing_review, reason):
        unresolved = dict(existing_review)
        unresolved.update(
            {
                "risk_score": max(int(existing_review.get("risk_score", 0) or 0), 65),
                "reasons": [reason],
                "suggested_action": "Keep case open and ask AP owner to review vendor reply",
                "requires_human_approval": True,
                "case_state": "open",
                "resolution_notes": (
                    f"{reason}; {reply.get('reply_summary', '').strip()}"
                ).strip(),
            }
        )
        return unresolved


def _decimal(value):
    try:
        if value is None or str(value).strip() == "":
            return None
        return Decimal(str(value))
    except (InvalidOperation, ValueError):
        return None
