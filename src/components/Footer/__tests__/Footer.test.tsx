import { render, screen } from "../../../__tests__/utils/test-utils";
import Footer from "../index";

describe("Footer Component", () => {
  it("should render footer with current year", () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(
      new RegExp(`All rights reserved.*${currentYear}`, "i")
    );

    expect(copyrightText).toBeInTheDocument();
  });

  it("should render footer as a footer element", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  it("should have proper structure and styling", () => {
    const { container } = render(<Footer />);

    // Check for container class
    const footerContainer = container.querySelector(".container");
    expect(footerContainer).toBeInTheDocument();

    // Check for inner content
    const innerContent = container.querySelector(".inner");
    expect(innerContent).toBeInTheDocument();
  });
});
