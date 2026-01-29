import HistoryTable from "../components/HistoryTable";
import CalculatorForm from "../components/CalculatorForm";
import { useCalculationHistory } from "../hooks/useCalculationHistory";
import { useState } from "react";

export default function HistoryPage() {
  const { history, loading, error, refreshHistory } = useCalculationHistory();
  const [selectedCalculation, setSelectedCalculation] = useState(null);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Calculation History</h2>

      <div className="row">
        {/* Calculator */}
        <div className="col-12 col-md-6 mb-4">
          {/* <CalculatorForm
            onSuccess={refreshHistory}
            selectedCalculation={selectedCalculation}
          /> */}
          <CalculatorForm
            onSuccess={() => {
              refreshHistory();
              setSelectedCalculation(null); // exit edit mode
            }}
            selectedCalculation={selectedCalculation}
          />
        </div>

        {/* History */}
        <div className="col-12 col-md-6">
          {loading && <div className="alert alert-info">Loading...</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <HistoryTable
              data={history}
              onDeleted={refreshHistory}
              onRowClick={setSelectedCalculation}
            />
          )}
        </div>
      </div>
    </div>
  );
}
