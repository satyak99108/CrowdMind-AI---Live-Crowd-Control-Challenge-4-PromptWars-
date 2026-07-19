import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { CrowdProvider, useCrowd } from "../contexts/CrowdContext";

// Test component that consumes the CrowdContext
const TestConsumer = () => {
  const {
    stadiumData,
    simState,
    incidents,
    recommendations,
    updateFanProfile,
    fanProfile,
    setSimSpeed,
    setSimScenario,
    addIncident,
    executeRecommendation,
  } = useCrowd();

  return (
    <div>
      <div data-testid="stadium-name">{stadiumData.stadiumName}</div>
      <div data-testid="sim-minute">{simState.matchMinute}</div>
      <div data-testid="sim-speed">{simState.speed}</div>
      <div data-testid="sim-scenario">{simState.scenario}</div>
      <div data-testid="incident-count">{incidents.length}</div>
      <div data-testid="rec-status">
        {recommendations.find((r) => r.id === "rec-01")?.status}
      </div>
      <div data-testid="fan-section">{fanProfile.seatSection}</div>
      
      <button
        data-testid="update-profile-btn"
        onClick={() => updateFanProfile({ seatSection: "sec-east-lower" })}
      >
        Update Profile
      </button>
      <button
        data-testid="set-speed-btn"
        onClick={() => setSimSpeed(2)}
      >
        Set Speed
      </button>
      <button
        data-testid="set-scenario-btn"
        onClick={() => setSimScenario("HALFTIME")}
      >
        Set Scenario
      </button>
      <button
        data-testid="add-incident-btn"
        onClick={() =>
          addIncident({
            title: "Test Ingress Jam",
            location: "Gate C",
            severity: "high",
            description: "Test description",
          })
        }
      >
        Add Incident
      </button>
      <button
        data-testid="execute-rec-btn"
        onClick={() => executeRecommendation("rec-01")}
      >
        Execute Rec
      </button>
    </div>
  );
};

describe("CrowdContext & Simulation Engine", () => {
  it("should throw error if useCrowd is used outside CrowdProvider", () => {
    // Suppress console.error output for the intentional boundary error test
    const consoleError = console.error;
    console.error = vi.fn();

    expect(() => render(<TestConsumer />)).toThrow(
      "useCrowd must be used within a CrowdProvider"
    );

    console.error = consoleError;
  });

  it("should initialize default stadium data and states correctly", () => {
    render(
      <CrowdProvider>
        <TestConsumer />
      </CrowdProvider>
    );

    expect(screen.getByTestId("stadium-name").textContent).toBe(
      "Lusail Iconic Stadium"
    );
    expect(screen.getByTestId("sim-speed").textContent).toBe("1");
    expect(screen.getByTestId("sim-scenario").textContent).toBe("PRE_MATCH");
    expect(screen.getByTestId("fan-section").textContent).toBe("sec-north-upper");
  });

  it("should update the fan profile section correctly", () => {
    render(
      <CrowdProvider>
        <TestConsumer />
      </CrowdProvider>
    );

    const updateBtn = screen.getByTestId("update-profile-btn");
    act(() => {
      updateBtn.click();
    });

    expect(screen.getByTestId("fan-section").textContent).toBe("sec-east-lower");
  });

  it("should update simulation speed settings", () => {
    render(
      <CrowdProvider>
        <TestConsumer />
      </CrowdProvider>
    );

    const speedBtn = screen.getByTestId("set-speed-btn");
    act(() => {
      speedBtn.click();
    });

    expect(screen.getByTestId("sim-speed").textContent).toBe("2");
  });

  it("should shift match phases and set timing correctly", () => {
    render(
      <CrowdProvider>
        <TestConsumer />
      </CrowdProvider>
    );

    const scenarioBtn = screen.getByTestId("set-scenario-btn");
    act(() => {
      scenarioBtn.click();
    });

    expect(screen.getByTestId("sim-scenario").textContent).toBe("HALFTIME");
    expect(screen.getByTestId("sim-minute").textContent).toBe("45");
  });

  it("should allow adding new crowd control incidents", () => {
    render(
      <CrowdProvider>
        <TestConsumer />
      </CrowdProvider>
    );

    const initialCount = Number(screen.getByTestId("incident-count").textContent);
    const addBtn = screen.getByTestId("add-incident-btn");
    
    act(() => {
      addBtn.click();
    });

    expect(Number(screen.getByTestId("incident-count").textContent)).toBe(
      initialCount + 1
    );
  });

  it("should handle executing recommendations and update state", () => {
    render(
      <CrowdProvider>
        <TestConsumer />
      </CrowdProvider>
    );

    expect(screen.getByTestId("rec-status").textContent).toBe("active");

    const execBtn = screen.getByTestId("execute-rec-btn");
    act(() => {
      execBtn.click();
    });

    expect(screen.getByTestId("rec-status").textContent).toBe("executed");
  });
});
