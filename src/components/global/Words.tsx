import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

/**
 * Splits a heading into words that rise into place one by one when the
 * nearest .rv (Reveal) ancestor scrolls into view. Keeps <br/> and inline
 * elements such as accent spans.
 */
export function Words({ children }: { children: ReactNode }) {
  let i = 0;
  const walk = (node: ReactNode): ReactNode =>
    Children.map(node, (child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child)
          .split(/(\s+)/)
          .map((part, k) =>
            /^\s+$/.test(part) || part === "" ? part : (
              <span key={k} className="hw">
                <span className="hw__i" style={{ "--i": i++ } as React.CSSProperties}>{part}</span>
              </span>
            ),
          );
      }
      if (isValidElement(child)) {
        const el = child as ReactElement<{ children?: ReactNode }>;
        if (el.type === "br") return el;
        return cloneElement(el, {}, walk(el.props.children));
      }
      return child;
    });
  return <>{walk(children)}</>;
}
