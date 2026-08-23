import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ProductForm from "./ProductForm";
import userEvent from "@testing-library/user-event";

describe("ProductForm", () => {
  let mediaQueryListeners;
  let mockMatchMedia;
  let user;
  let onSubmit;

  beforeEach(() => {
    mediaQueryListeners = [];

    mockMatchMedia = vi.fn((query) => ({
      matches: window.innerWidth >= 600,
      media: query,
      addEventListener: vi.fn((_, handler) => {
        mediaQueryListeners.push(handler);
      }),
      removeEventListener: vi.fn(),
    }));

    window.matchMedia = mockMatchMedia;

    user = userEvent.setup();
    onSubmit = vi.fn();
  });

  const groundCoffee = {
    id: 1,
    name: "Colombia Huila",
    category_id: 1,
    category: "Coffee",
    price: 16.0,
    stock_quantity: 28,
    attributes: {
      Origin: "Colombia",
      "Roast Level": "Medium",
      Format: "Ground",
      Weight: "250",
    },
  };

  const tea = {
    id: 2,
    name: "Japanese Sencha",
    category_id: 2,
    category: "Tea",
    price: 12.5,
    stock_quantity: 7,
    attributes: {
      Type: "Green",
      Origin: "Japan",
      Format: "Loose Leaf",
      "Caffeine Level": "Medium",
      Weight: "100",
    },
  };

  const americano = {
    id: 3,
    name: "americano",
    category_id: 3,
    category: "Ready-to-Drink",
    price: 4.0,
    stock_quantity: 15,
    attributes: {
      Base: "Coffee",
      Volume: "400",
    },
  };

  const accessory = {
    id: 4,
    name: "Baratza Encore Grinder",
    category_id: 4,
    category: "Accessories",
    price: 140.0,
    stock_quantity: 4,
    attributes: {
      Type: "Grinder",
      "Compatible With": "Coffee",
    },
  };

  // Rendering modes
  it("renders 'Add product' as the submit button label in adding mode", () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={groundCoffee}
          categoryId="1"
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: "Add product" })
    ).toBeInTheDocument();
  });
  it("renders 'Save changes' as the submit button label in editing mode", () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={groundCoffee}
          categoryId="1"
          onSubmit={vi.fn()}
          isEditing={true}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: "Save changes" })
    ).toBeInTheDocument();
  });
  it("renders the admin authorization card in editing mode", () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={groundCoffee}
          categoryId="1"
          onSubmit={vi.fn()}
          isEditing={true}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "Admin authorization" })
    ).toBeInTheDocument();
  });
  it("does not render the admin authorization card in adding mode", () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={groundCoffee}
          categoryId="1"
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.queryByRole("heading", { name: "Admin authorization" })
    ).not.toBeInTheDocument();
  });
  it("renders the current values sidebar card in editing mode on desktop screens", () => {
    window.innerWidth = 700;

    render(
      <MemoryRouter>
        <ProductForm
          product={groundCoffee}
          categoryId="1"
          onSubmit={vi.fn()}
          isEditing={true}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /current values/i })
    ).toBeInTheDocument();
  });
  it("does not render the current values sidebar card in editing mode on mobile screens", () => {
    window.innerWidth = 400;

    render(
      <MemoryRouter>
        <ProductForm
          product={groundCoffee}
          categoryId="1"
          onSubmit={vi.fn()}
          isEditing={true}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.queryByRole("heading", { name: /current values/i })
    ).not.toBeInTheDocument();
  });
  it("renders the tip sidebar card in adding mode on desktop screens", () => {
    window.innerWidth = 700;

    render(
      <MemoryRouter>
        <ProductForm
          product={groundCoffee}
          categoryId="1"
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /tip/i })).toBeInTheDocument();
  });
  it("does not render the tip sidebar card in adding mode on mobile screens", () => {
    window.innerWidth = 400;

    render(
      <MemoryRouter>
        <ProductForm
          product={groundCoffee}
          categoryId="1"
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.queryByRole("heading", { name: /tip/i })
    ).not.toBeInTheDocument();
  });

  // Category field
  it("disables the category field in editing mode", () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={groundCoffee}
          categoryId="1"
          onSubmit={vi.fn()}
          isEditing={true}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/category/i)).toBeDisabled();
  });
  it("enables the category field in adding mode", () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={groundCoffee}
          categoryId="1"
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/category/i)).toBeEnabled();
  });

  // Attributes
  it("renders the attributes placeholder when in adding mode and no category is selected", () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={{}}
          categoryId=""
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Select a category above to see its required attributes")
    ).toBeInTheDocument();
  });
  it("renders attribute fields when a category is selected in adding mode", async () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={{}}
          categoryId=""
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    // Select a category
    const categoryField = screen.getByLabelText(/category/i);
    await user.selectOptions(categoryField, "Coffee");
    expect(screen.getByLabelText(/roast level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/format/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/origin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weight/i)).toBeInTheDocument();
  });
  it("renders attribute fields pre-filled with product attributes in editing mode", () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={groundCoffee}
          categoryId="1"
          onSubmit={vi.fn()}
          isEditing={true}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/roast level/i)).toHaveValue("Medium");
    expect(screen.getByLabelText(/format/i)).toHaveValue("Ground");
    expect(screen.getByLabelText(/origin/i)).toHaveValue("Colombia");
    expect(screen.getByLabelText(/weight/i)).toHaveValue(250);
  });
  it("renders a select field for attributes that have a fixed set of values", () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={groundCoffee}
          categoryId="1"
          onSubmit={vi.fn()}
          isEditing={true}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/roast level/i).tagName).toBe("SELECT");
    expect(screen.getByLabelText(/format/i).tagName).toBe("SELECT");
  });
  it("renders a text input for Origin", () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={groundCoffee}
          categoryId="1"
          onSubmit={vi.fn()}
          isEditing={true}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/origin/i)).toHaveAttribute("type", "text");
  });
  it("renders a number input for Weight", () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={groundCoffee}
          categoryId="1"
          onSubmit={vi.fn()}
          isEditing={true}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/weight/i)).toHaveAttribute("type", "number");
  });
  it("renders a number input for Volume", () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={americano}
          categoryId="3"
          onSubmit={vi.fn()}
          isEditing={true}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/volume/i)).toHaveAttribute("type", "number");
  });
  it("renders the correct attribute fields when Coffee category is selected", () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={groundCoffee}
          categoryId="1"
          onSubmit={vi.fn()}
          isEditing={true}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/roast level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/format/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/origin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weight/i)).toBeInTheDocument();
  });
  it("renders the correct attribute fields when Tea category is selected", () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={tea}
          categoryId="2"
          onSubmit={vi.fn()}
          isEditing={true}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/origin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/format/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/caffeine level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weight/i)).toBeInTheDocument();
  });
  it("renders the correct attribute fields when Ready-to-Drink category is selected", () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={americano}
          categoryId="3"
          onSubmit={vi.fn()}
          isEditing={true}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/base/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/volume/i)).toBeInTheDocument();
  });
  it("renders the correct attribute fields when Accessories category is selected", () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={accessory}
          categoryId="4"
          onSubmit={vi.fn()}
          isEditing={true}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/compatible with/i)).toBeInTheDocument();
  });
  it("clears all field errors when a new category is selected", async () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={{}}
          categoryId=""
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    // Cause field errors to appear by attempting to submit the form without filling the fields
    const addBtn = screen.getByRole("button", { name: /add product/i });
    await user.click(addBtn);
    expect(screen.queryAllByRole("alert").length).toBeGreaterThan(0);

    // Select a category
    const categoryField = screen.getByLabelText(/category/i);
    await user.selectOptions(categoryField, "Coffee");
    expect(screen.queryAllByRole("alert")).toHaveLength(0);
  });

  // Form error banner
  it("renders FormError when the error prop is truthy", () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={{}}
          categoryId=""
          onSubmit={vi.fn()}
          isEditing={false}
          error="Failed to fetch"
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    const formError = screen.getByRole("alert");
    expect(formError).toBeInTheDocument();
    expect(formError).toHaveTextContent("Failed to fetch");
  });
  it("does not render FormError when the error prop is falsy", () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={{}}
          categoryId=""
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  // Validation — field errors on submit
  it("shows a category field error when submitted without a category in adding mode", async () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={{}}
          categoryId=""
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /add product/i }));
    expect(screen.getByText(/category is required/i)).toBeInTheDocument();
  });
  it("shows a name field error when submitted with an empty name", async () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={{}}
          categoryId=""
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /add product/i }));
    expect(screen.getByText(/product name is required/i)).toBeInTheDocument();
  });
  it("shows a price field error when submitted with an empty price or a price of 0 or less", async () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={{}}
          categoryId=""
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /add product/i }));
    expect(screen.getByText(/price is required/i)).toBeInTheDocument();
  });
  it("shows a quantity field error when submitted with an empty quantity", async () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={{}}
          categoryId=""
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /add product/i }));
    expect(screen.getByText(/quantity is required/i)).toBeInTheDocument();
  });
  it("shows a quantity field error when submitted with a negative quantity", async () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={{}}
          categoryId=""
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    const quantityField = screen.getByLabelText(/quantity/i);
    await user.type(quantityField, "-1");
    await user.click(screen.getByRole("button", { name: /add product/i }));
    expect(screen.getByText(/quantity can't be negative/i)).toBeInTheDocument();
  });
  it("shows attribute field errors when submitted with empty attribute fields", async () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={{}}
          categoryId=""
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    const categoryField = screen.getByLabelText(/category/i);
    await user.selectOptions(categoryField, "Ready-to-Drink");
    await user.click(screen.getByRole("button", { name: /add product/i }));
    expect(screen.getByText(/base is required/i)).toBeInTheDocument();
    expect(screen.getByText(/volume is required/i)).toBeInTheDocument();
  });
  it("shows a password field error when submitted with an empty password in editing mode", async () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={americano}
          categoryId="3"
          onSubmit={vi.fn()}
          isEditing={true}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /save changes/i }));
    expect(screen.getByText(/admin password is required/i)).toBeInTheDocument();
  });
  it("shows a password field error when the error prop is 'Incorrect password'", () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={americano}
          categoryId="3"
          onSubmit={vi.fn()}
          isEditing={true}
          error="Incorrect password"
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getAllByText(/incorrect password/i)).toHaveLength(2);
  });
  it("sets the submit button label to 'Fix errors to save' when field errors exist", async () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={{}}
          categoryId=""
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /add product/i }));
    expect(
      screen.queryByRole("button", { name: /add product/i })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /fix errors to save/i })
    ).toBeInTheDocument();
  });
  it("does not call onSubmit when field errors exist", async () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={{}}
          categoryId=""
          onSubmit={onSubmit}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /add product/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  // Validation — clearing field errors
  it("clears the name field error when the user types a non-empty value", async () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={{}}
          categoryId=""
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /add product/i }));
    expect(screen.getByText(/product name is required/i)).toBeInTheDocument();

    const nameField = screen.getByLabelText(/product name/i);
    await user.type(nameField, "Cold Brew");
    expect(
      screen.queryByText(/product name is required/i)
    ).not.toBeInTheDocument();
  });
  it("clears the price field error when the user types a valid price", async () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={{}}
          categoryId=""
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /add product/i }));
    expect(screen.getByText(/price is required/i)).toBeInTheDocument();

    const priceField = screen.getByLabelText(/price/i);
    await user.type(priceField, "4");
    expect(screen.queryByText(/price is required/i)).not.toBeInTheDocument();
  });
  it("clears the quantity field error when the user types a valid quantity", async () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={{}}
          categoryId=""
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /add product/i }));
    expect(screen.getByText(/quantity is required/i)).toBeInTheDocument();

    const quantityField = screen.getByLabelText(/quantity/i);
    await user.type(quantityField, "20");
    expect(screen.queryByText(/quantity is required/i)).not.toBeInTheDocument();
  });
  it("clears an attribute field error when the user types a value", async () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={{}}
          categoryId=""
          onSubmit={vi.fn()}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    const categoryField = screen.getByLabelText(/category/i);
    await user.selectOptions(categoryField, "Ready-to-Drink");
    await user.click(screen.getByRole("button", { name: /add product/i }));
    expect(screen.getByText(/volume is required/i)).toBeInTheDocument();

    const volumeField = screen.getByLabelText(/volume/i);
    await user.type(volumeField, "400");
    expect(screen.queryByText(/volume is required/i)).not.toBeInTheDocument();
  });
  it("clears the password field error when the user types in the password field", async () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={americano}
          categoryId="3"
          onSubmit={vi.fn()}
          isEditing={true}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /save changes/i }));
    expect(screen.getByText(/admin password is required/i)).toBeInTheDocument();

    const passwordField = screen.getByLabelText(/admin password/i);
    await user.type(passwordField, "brew");
    expect(
      screen.queryByText(/admin password is required/i)
    ).not.toBeInTheDocument();
  });

  // Successful submission
  it("calls onSubmit with the correct payload when the form is valid in adding mode", async () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={{}}
          categoryId=""
          onSubmit={onSubmit}
          isEditing={false}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    const categoryField = screen.getByLabelText(/category/i);
    await user.selectOptions(categoryField, "Ready-to-Drink");
    const nameField = screen.getByLabelText(/product name/i);
    await user.type(nameField, "Americano");
    const priceField = screen.getByLabelText(/price/i);
    await user.type(priceField, "4");
    const quantityField = screen.getByLabelText(/quantity/i);
    await user.type(quantityField, "20");
    const baseField = screen.getByLabelText(/base/i);
    await user.selectOptions(baseField, "Coffee");
    const volumeField = screen.getByLabelText(/volume/i);
    await user.type(volumeField, "400");

    const addBtn = screen.getByRole("button", { name: /add product/i });
    await user.click(addBtn);

    expect(onSubmit).toHaveBeenCalledWith({
      category: "Ready-to-Drink",
      name: "Americano",
      description: "",
      price: "4",
      quantity: "20",
      password: "",
      Base: "Coffee",
      Volume: "400",
    });
  });
  it("calls onSubmit with the correct payload when the form is valid in editing mode", async () => {
    render(
      <MemoryRouter>
        <ProductForm
          product={americano}
          categoryId="3"
          onSubmit={onSubmit}
          isEditing={true}
          error=""
          onDismissError={vi.fn()}
          onCancel={vi.fn()}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    const passwordField = screen.getByLabelText(/admin password/i);
    await user.type(passwordField, "brew123");

    const addBtn = screen.getByRole("button", { name: /save changes/i });
    await user.click(addBtn);

    expect(onSubmit).toHaveBeenCalledWith({
      category: americano.category,
      name: americano.name,
      description: "",
      price: americano.price,
      quantity: americano.stock_quantity,
      password: "brew123",
      Base: americano.attributes.Base,
      Volume: americano.attributes.Volume,
    });
  });

  // Cancel
  it("calls onCancel when the Cancel button is clicked", async () => {
    const onCancel = vi.fn();

    render(
      <MemoryRouter>
        <ProductForm
          product={americano}
          categoryId="3"
          onSubmit={vi.fn()}
          isEditing={true}
          error=""
          onDismissError={vi.fn()}
          onCancel={onCancel}
          onPasswordChange={vi.fn()}
        />
      </MemoryRouter>
    );

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);

    expect(onCancel).toHaveBeenCalled();
  });
});
