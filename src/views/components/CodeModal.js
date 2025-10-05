import {
    Div,
    Button,
    H3,
    P,
    Pre,
    Code,
    Span,
} from "../../modules/html.js";
import { useState } from "../../modules/hooks.js";

function CodeModal({ isOpen, onClose, title, code, language = "javascript" }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    if (!isOpen) return "";

    return Div(
        { class: "modal-overlay" },
        Div(
            { class: "modal-container" },
            // Modal Header
            Div(
                { class: "modal-header" },
                Div(
                    { class: "modal-title-section" },
                    H3({ class: "modal-title" }, title),
                    P({ class: "modal-subtitle" }, `${language} code`)
                ),
                Div(
                    { class: "modal-actions" },
                    Button(
                        {
                            class: `btn btn-sm ${copied ? "btn-success" : "btn-outline"}`,
                            onclick: copyToClipboard,
                        },
                        Span({ class: copied ? "copied-icon" : "copy-icon" }, copied ? "✓" : "📋"),
                        Span({}, copied ? "Copied!" : "Copy")
                    ),
                    Button(
                        {
                            class: "btn btn-ghost btn-sm close-btn",
                            onclick: onClose,
                        },
                        "✕"
                    )
                )
            ),

            // Modal Body
            Div(
                { class: "modal-body" },
                Pre(
                    { class: "code-block" },
                    Code(
                        { class: `language-${language}` },
                        code
                    )
                )
            )
        )
    );
}

export default CodeModal;
