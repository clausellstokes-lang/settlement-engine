import math, random, json

K = 3.5          # MEASURED settlementStrategy.js:129
S = 0.35         # HABIT_SPAN proposal
LO, HI = 1 - S, 1 + S

def softmax(scores, k=K):
    scaled = [k * s for s in scores]
    m = max(scaled)
    exps = [math.exp(x - m) for x in scaled]
    t = sum(exps) or 1.0
    return [e / t for e in exps]

def load(p, f):
    num = [pi * fi for pi, fi in zip(p, f)]
    Z = sum(num)
    return [n / Z for n in num]

def report(name, scores, factors):
    p = softmax(scores)
    q = load(p, factors)
    perprob = [qi / pi for qi, pi in zip(q, p)]
    odds = []
    for i in range(len(p)):
        for j in range(len(p)):
            if i == j:
                continue
            odds.append((q[i] / q[j]) / (p[i] / p[j]))
    return {
        "case": name,
        "p_dark": [round(x, 4) for x in p],
        "factors": factors,
        "p_habit": [round(x, 4) for x in q],
        "perprob": [round(x, 4) for x in perprob],
        "perprob_max": round(max(perprob), 4),
        "perprob_min": round(min(perprob), 4),
        "deleted_pin_reds": bool(max(perprob) > HI or min(perprob) < LO),
        "odds_min": round(min(odds), 6),
        "odds_max": round(max(odds), 6),
        "odds_inside_law": bool(min(odds) >= LO / HI - 1e-12 and max(odds) <= HI / LO + 1e-12),
    }

out = {"analytic": {"law_lo": round(LO / HI, 6), "law_hi": round(HI / LO, 6),
                    "deleted_lo": LO, "deleted_hi": HI,
                    "true_perprob_range": [round(LO / HI, 4), round(HI / LO, 4)]}}

sc4 = [0.90, 0.85, 0.80, 0.20]
out["caseA"] = report("A conditioned court, deploy at CAP", sc4, [0.65, 1.35, 0.65, 0.65])
out["caseB"] = report("B reinforced move is LOW probability", sc4, [0.65, 0.65, 0.65, 1.35])

# case C: eleven-move court, deploy at cap.
# THE EXECUTED RESULT IS THE TARGET, NEVER A PRIOR PUBLICATION. This score set returns
# deploy per-probability ratio 1.6933 at p_deploy = 0.2104 dark, and those are the two
# figures the volume's SS3b EXECUTED table quotes.
# STRUCK: the earlier 1.7941 (and the p_deploy ~ 0.1464 it would have implied) DOES NOT
# REPRODUCE from any score set this script names. It is recorded here as struck rather
# than deleted, because a comment that states a struck figure as its target is an
# instruction to a future reader to "fix" the script until the struck number comes back
# -- which is the same defect, one layer down, that the struck figure itself was.
sc11 = [0.90] + [0.62] * 10
fac11 = [1.35] + [0.65] * 10
out["caseC"] = report("C eleven-move court", sc11, fac11)
out["caseC"]["note_pdeploy"] = round(softmax(sc11)[0], 4)

# THREE-CANDIDATE HAND WALK requested by the chair
sc3 = [0.80, 0.55, 0.30]
out["chair_three_candidate"] = report("chair: three candidates, one bounded factor", sc3, [1.35, 1.0, 1.0])

# randomized sweep
random.seed(20260806)
worst_pp, best_pp = 0.0, 9.9
viol_pp = 0
omin, omax = 9.9, 0.0
viol_odds = 0
N = 200000
for _ in range(N):
    n = random.choice([2, 3, 4, 5, 11])
    scores = [random.uniform(0.0, 1.0) for _ in range(n)]
    factors = [random.uniform(LO, HI) for _ in range(n)]
    p = softmax(scores)
    q = load(p, factors)
    for i in range(n):
        r = q[i] / p[i]
        worst_pp = max(worst_pp, r)
        best_pp = min(best_pp, r)
        if r > HI or r < LO:
            viol_pp += 1
            break
    for i in range(n):
        for j in range(n):
            if i == j:
                continue
            o = (q[i] / q[j]) / (p[i] / p[j])
            omin = min(omin, o)
            omax = max(omax, o)
            if o < LO / HI - 1e-9 or o > HI / LO + 1e-9:
                viol_odds += 1

out["sweep"] = {
    "N": N,
    "deleted_perprob_violation_rate": round(viol_pp / N, 4),
    "deleted_perprob_worst": round(worst_pp, 4),
    "deleted_perprob_best": round(best_pp, 4),
    "odds_observed_range": [round(omin, 6), round(omax, 6)],
    "odds_analytic_range": [round(LO / HI, 6), round(HI / LO, 6)],
    "odds_violations": viol_odds,
    "reachability_fill": [round(omin / (LO / HI), 4), round(omax / (HI / LO), 4)],
}
print(json.dumps(out, indent=1))
