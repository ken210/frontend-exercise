import React from "react";
import MultiSelect from "./";
import { render, getByText, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";

const immediate = () =>
  new Promise((resolve) => {
    setImmediate(resolve);
  });

describe("MultiSelect", () => {
  it("should render a title, a search bar, a loading and a button", () => {
    const onSubmit = jest.fn();

    const { getByRole, getByText } = render(
      <MultiSelect
        preselectedItems={[]}
        title="Test title"
        getItems={new Promise(() => {})}
        onSubmit={onSubmit}
      />
    );

    const title = getByText("Test title");
    expect(title).toBeInTheDocument();

    const search = getByRole("search");
    expect(search).toBeInTheDocument();

    const loading = getByText("Laden ...");
    expect(loading).toBeInTheDocument();

    const button = getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should render a list after loading", async () => {
    const onSubmit = jest.fn();

    let container;

    await act(async () => {
      container = render(
        <MultiSelect
          preselectedItems={[]}
          title="Test title"
          getItems={async () => ["Hello", "World"]}
          onSubmit={onSubmit}
        />
      );
    });

    const { getByRole } = container;

    const list = getByRole("list");
    expect(list).toBeInTheDocument();
  });

  it("should filter list as you type on search", async () => {
    const onSubmit = jest.fn();

    let container;

    await act(async () => {
      container = render(
        <MultiSelect
          preselectedItems={[]}
          title="Test title"
          getItems={async () => ["Hello", "World"]}
          onSubmit={onSubmit}
        />
      );
    });

    const { getByRole, getAllByRole } = container;
    const search = getByRole("search");

    expect(getAllByRole("listitem")).toHaveLength(2);

    act(() => {
      fireEvent.change(search, { target: { value: "h" } });
    });

    expect(getAllByRole("listitem")).toHaveLength(1);
  });

  it("should place selected items on top, in alfabetical order", async () => {
    const onSubmit = jest.fn();

    let container;

    await act(async () => {
      container = render(
        <MultiSelect
          preselectedItems={["Hello"]}
          title="Test title"
          getItems={async () => ["Hello", "World", "Humans", "And Others"]}
          onSubmit={onSubmit}
        />
      );
    });

    const { getByRole, getAllByRole } = container;
    const items = getAllByRole("listitem");

    expect(getAllByRole("listitem")).toHaveLength(4);
    expect(getByText(getAllByRole("listitem")[0], "Hello")).toBeInTheDocument();

    act(() => {
      // click the last item
      const checkboxes = getAllByRole("checkbox");
      fireEvent.click(checkboxes[checkboxes.length - 1]);
    });

    expect(
      getByText(getAllByRole("listitem")[0], "And Others")
    ).toBeInTheDocument();
  });
});
