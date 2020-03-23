import React from "react";
import MultiSelectItem from "./multi-select-item";
import { render } from "@testing-library/react";

describe("MultiSelectItem", () => {
  it("should render a label with correct text", () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <MultiSelectItem search="" selected={false} onChange={onChange}>
        Hello
      </MultiSelectItem>
    );
    const label = getByText("Hello");
    expect(label).toBeInTheDocument();
  });

  it("should render a label with checkbox", async () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <MultiSelectItem search="" selected={false} onChange={onChange}>
        Hello
      </MultiSelectItem>
    );
    const checkbox = getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  it("should render a label with a checkmark span", async () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <MultiSelectItem search="" selected={false} onChange={onChange}>
        Hello
      </MultiSelectItem>
    );
    const checkmark = getByRole("button");
    expect(checkmark).toBeInTheDocument();
  });

  describe("Selected", () => {
    it("should mark checkbox as checked", () => {
      const onChange = jest.fn();
      const { getByRole } = render(
        <MultiSelectItem search="" selected={true} onChange={onChange}>
          Hello
        </MultiSelectItem>
      );

      const checkbox = getByRole("checkbox");

      expect(checkbox).toHaveAttribute("checked");
    });

    it("should not highlight the text", () => {
      const onChange = jest.fn();
      const { getByText } = render(
        <MultiSelectItem search="hello" selected={true} onChange={onChange}>
          Hello World
        </MultiSelectItem>
      );

      const item = getByText("Hello World");
      expect(item).toBeInTheDocument();

      expect(() => {
        getByText("Hello");
      }).toThrowError();
    });
  });

  describe("Deselected", () => {
    it("should highlight the given string", () => {
      const onChange = jest.fn();
      const { getByText } = render(
        <MultiSelectItem search="hello" selected={false} onChange={onChange}>
          Hello World
        </MultiSelectItem>
      );

      const hello = getByText("Hello");
      const world = getByText("World");
      expect(hello).toBeInTheDocument();
      expect(world).toBeInTheDocument();

      expect(() => {
        getByText("Hello World");
      }).toThrowError();
    });
  });
});
