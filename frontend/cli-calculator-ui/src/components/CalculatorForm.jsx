import { useState,useEffect } from "react";
import { calculateExpression,updateCalculation } from "../api/calculatorApi";

const operators = ["+", "-", "*", "/", "%"];

export default function CalculatorForm({ onSuccess, selectedCalculation }) {
  const [expression, setExpression] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-fill when history row is clicked
  useEffect(() => {
    if (selectedCalculation) {
      setExpression(
         `${selectedCalculation.expression}`,
      );
      setError("");
    }
    else{
      setExpression("");
      setError("");
    }
  }, [selectedCalculation]);

  const isValidChar = (char) => /[0-9.+\-*/%]/.test(char);

  const handleChange = (e) => {
    const value = e.target.value;
    if ([...value].every(isValidChar)) {
      setExpression(value);
    }
  };

  const appendValue = (val) => {
    setError("");
    const lastChar = expression.slice(-1);
    if (operators.includes(lastChar) && operators.includes(val)) return;
    setExpression((prev) => prev + val);
  };

  const backspace = () => {
    setError("");
    setExpression((prev) => prev.slice(0, -1));
  };

  const clearInput = () => {
    setExpression("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!expression) return;

    setLoading(true);
    setError("");

    try {
      if(selectedCalculation?.id){
        await updateCalculation(selectedCalculation.id, expression);
        setExpression("");
        onSuccess();
      }
      else{
        await calculateExpression(expression);
        setExpression("");
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid calculation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-lg border-0 mb-4">
      <div className="card-body p-4">
        <h5 className="text-center mb-3 fw-semibold">Calculator</h5>

        <form onSubmit={handleSubmit}>
          {/* Display */}
          <input
            type="text"
            className="form-control mb-3 text-end fs-4 fw-semibold"
            style={{ fontFamily: "monospace" }}
            placeholder="0"
            value={expression}
            onChange={handleChange}
          />

          {/* Buttons */}
          <div className="calculator-grid">
            {/* Operators */}
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => appendValue("+")}
            >
              +
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => appendValue("-")}
            >
              −
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => appendValue("*")}
            >
              ×
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => appendValue("/")}
            >
              ÷
            </button>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => appendValue("%")}
            >
              %
            </button>

            {/* Numbers */}
            {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
              <button
                key={num}
                type="button"
                className="btn btn-outline-dark"
                onClick={() => appendValue(num.toString())}
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={() => appendValue("0")}
            >
              0
            </button>
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={() => appendValue(".")}
            >
              .
            </button>

            {/* Actions */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={backspace}
            >
              ⌫
            </button>

            <button
              type="button"
              className="btn btn-warning"
              onClick={clearInput}
            >
              Clear
            </button>

            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? "..." : "="}
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-danger py-2 mt-3 mb-0 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
