import { useEffect, useState, useCallback } from "react";
import { getCalculationHistory } from "../api/calculatorApi";

export function useCalculationHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCalculationHistory();
      setHistory(data);
      setError("");
    } catch {
      setError("Failed to load calculation history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, loading, error, refreshHistory: fetchHistory };
}
