import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "../components/StatusBadge";
import { SeverityBadge } from "../components/SeverityBadge";

describe("StatusBadge Component", () => {
  it("renders correctly with new status", () => {
    render(<StatusBadge status="new" />);
    expect(screen.getByText("Detected")).toBeInTheDocument();
  });

  it("renders correctly with in_progress status", () => {
    render(<StatusBadge status="in_progress" />);
    expect(screen.getByText("Dispatching")).toBeInTheDocument();
  });

  it("renders correctly with resolved status", () => {
    render(<StatusBadge status="resolved" />);
    expect(screen.getByText("Resolved")).toBeInTheDocument();
  });
});

describe("SeverityBadge Component", () => {
  it("renders low severity correctly", () => {
    render(<SeverityBadge severity="low" />);
    expect(screen.getByText("Low")).toBeInTheDocument();
  });

  it("renders medium severity correctly", () => {
    render(<SeverityBadge severity="medium" />);
    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  it("renders critical severity correctly", () => {
    render(<SeverityBadge severity="critical" />);
    expect(screen.getByText("Critical")).toBeInTheDocument();
  });
});
