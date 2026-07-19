import { useCallback } from "react";
import { neonPatternId } from "../components/NeonPatternDefs";

export function useNeonCharts() {
  const getFill = useCallback(
    (color: string) => ({
      fill: `url(#${neonPatternId(color)})`,
      stroke: color,
      strokeWidth: 1.5,
    }),
    []
  );

  return { getFill };
}
