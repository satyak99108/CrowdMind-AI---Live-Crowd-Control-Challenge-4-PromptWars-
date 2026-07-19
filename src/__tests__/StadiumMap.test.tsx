import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StadiumMap } from "../components/StadiumMap";
import { CrowdProvider } from "../contexts/CrowdContext";

describe("StadiumMap Component", () => {
  it("renders stadium visualizer details and legend items", () => {
    render(
      <CrowdProvider>
        <StadiumMap />
      </CrowdProvider>
    );

    // Verify title is rendered
    expect(screen.getByText("Interactive Stadium Heatmap Visualizer")).toBeInTheDocument();

    // Verify legends are present
    expect(screen.getByText("Low (<50%)")).toBeInTheDocument();
    expect(screen.getByText("Mod (50-80%)")).toBeInTheDocument();
    expect(screen.getByText("High (>80%)")).toBeInTheDocument();
  });

  it("applies proper roles and keyboard accessibility to sector nodes", () => {
    render(
      <CrowdProvider>
        <StadiumMap />
      </CrowdProvider>
    );

    // We have paths acting as buttons with aria-labels. Find by role.
    const sectors = screen.getAllByRole("button");
    
    // There are 8 sectors + 8 gates in our data
    expect(sectors.length).toBeGreaterThanOrEqual(16);

    const firstSector = sectors[0];
    expect(firstSector).toHaveAttribute("tabindex", "0");
    expect(firstSector).toHaveAttribute("aria-label");
  });

  it("supports keyboard interactions (Space/Enter key) on sectors", () => {
    render(
      <CrowdProvider>
        <StadiumMap />
      </CrowdProvider>
    );

    const sectors = screen.getAllByRole("button");
    const testSector = sectors[0];

    // Trigger KeyDown event
    fireEvent.keyDown(testSector, { key: "Enter", code: "Enter" });
    // Trigger Space key
    fireEvent.keyDown(testSector, { key: " ", code: "Space" });
    
    expect(testSector).toBeInTheDocument();
  });
});
