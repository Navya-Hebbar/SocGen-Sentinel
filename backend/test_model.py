import sys
sys.path.insert(0, '.')
from app.model import risk_model

risk_model.load_data()
metrics = risk_model.train()
acc = metrics["accuracy"]
print(f"Accuracy: {acc}")
print("\nClassification Report:")
print(f"{'Class':<10} | {'Precision':<10} | {'Recall':<10} | {'F1-Score':<10}")
print("-" * 45)
report = metrics.get("report", {})
for cls in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]:
    cls_metrics = report.get(cls, {})
    p = cls_metrics.get("precision", 0.0)
    r = cls_metrics.get("recall", 0.0)
    f1 = cls_metrics.get("f1-score", 0.0)
    print(f"{cls:<10} | {p:<10.2f} | {r:<10.2f} | {f1:<10.2f}")
print("-" * 45)

pred = risk_model.predict("VND-0001")
print(f"VND-0001 prediction: {pred}")

expl = risk_model.explain("VND-0001")
print("Top SHAP factors:")
for c in expl["contributions"][:5]:
    name = c["display_name"]
    pct = c["impact_pct"]
    d = c["direction"]
    print(f"  {name}: {pct}% ({d})")

fr = risk_model.future_risk("VND-0001", 60)
print(f"Future risk - escalation prob: {fr['escalation_probability']}%")
print(f"Trajectory: {[t['predicted_severity'] for t in fr['trajectory']]}")
