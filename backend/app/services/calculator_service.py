import ast
import operator


ALLOWED_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Mod: operator.mod,
}

def evaluate_expression(expression: str) -> float:
    def _eval(node):
        if isinstance(node, ast.BinOp):
            op_type = type(node.op)
            if op_type not in ALLOWED_OPERATORS:
                raise ValueError(f"Operator {op_type} not allowed")
            return ALLOWED_OPERATORS[op_type](
                _eval(node.left),
                _eval(node.right)
            )
        if isinstance(node, ast.Constant):
            if isinstance(node.value, (int, float)):
                return node.value
            else:
                raise ValueError("Only numeric constants are allowed")
        raise ValueError("Invalid expression")

    parsed = ast.parse(expression, mode="eval").body
    return _eval(parsed)
