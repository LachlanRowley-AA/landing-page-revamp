"use client";

import React, { useState } from "react";
import {
  TextInput,
  NumberInput,
  Select,
  Button,
  Paper,
  Title,
  Group,
  Stack,
  Text,
} from "@mantine/core";

type Lender = "Westpac" | "Branded" | "Resimac" | "Other" | "";

const lenderDefaults: Record<
  Lender,
  { calcMethod: string; repaymentTiming: string; balloonPreset: boolean }
> = {
  Westpac: { calcMethod: "TakesFinal", repaymentTiming: "Arrears", balloonPreset: false },
  Branded: { calcMethod: "Additional", repaymentTiming: "Arrears", balloonPreset: false },
  Resimac: { calcMethod: "OnTop", repaymentTiming: "Advance", balloonPreset: false },
  Other: { calcMethod: "", repaymentTiming: "", balloonPreset: false },
  "": { calcMethod: "", repaymentTiming: "", balloonPreset: false },
};

export default function EffectiveRateCalculator() {
  const [loanAmount, setLoanAmount] = useState<number | "">(0);
  const [fee, setFee] = useState<number | "">(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number | "">(0);
  const [termLength, setTermLength] = useState<number | "">(0);
  const [balloonInput, setBalloonInput] = useState<number | "">(0);
  const [balloonType, setBalloonType] = useState<"dollar" | "percent">("dollar");
  const [lender, setLender] = useState<Lender>("");
  const [calcMethod, setCalcMethod] = useState<string>("");
  const [repaymentTiming, setRepaymentTiming] = useState<string>("");
  const [result, setResult] = useState<{ rate: number; text: string } | null>(null);

  const onLenderChange = (value: Lender) => {
    setLender(value);
    const defaults = lenderDefaults[value];
    setCalcMethod(defaults.calcMethod);
    setRepaymentTiming(defaults.repaymentTiming);
  };

  const calculateEffectiveRate = (
    loanAmount: number,
    fee: number,
    interestRate: number,
    termLength: number,
    balloonValue: number,
    calcMethod: string,
    repaymentTiming: string = "Arrears"
  ) => {
    if (loanAmount <= 0 || termLength <= 0) return 0;
    const financedAmount = loanAmount + fee;
    const r = interestRate / 100 / 12;
    if (r === 0) return (financedAmount - balloonValue) / termLength;

    let n = termLength;
    if (calcMethod === "TakesFinal" && balloonValue > 0) n = termLength - 1;

    let payment =
      ((financedAmount - balloonValue / Math.pow(1 + r, termLength)) * r) /
      (1 - Math.pow(1 + r, -n));

    if (repaymentTiming === "Advance") payment = payment / (1 + r);
    return payment;
  };

  const findEffectiveRateBinaryBalloon = (
    principal: number,
    fee: number,
    realMonthly: number,
    numMonths: number,
    balloonValue: number,
    balloonCalcMethod: string,
    repaymentTiming: string = "Arrears",
    tolerance = 0.01,
    maxIterations = 1000
  ) => {
    if (principal <= 0 || realMonthly >= 0 || balloonValue < 0)
      return { annualRate: 0, iterations: 0 };

    let low = 0,
      high = 100,
      mid = 0,
      iteration = 0;

    for (iteration = 1; iteration <= maxIterations; iteration++) {
      mid = (low + high) / 2;
      const value = calculateEffectiveRate(
        principal,
        fee,
        mid,
        numMonths,
        balloonValue,
        balloonCalcMethod,
        repaymentTiming
      );
      const diff = Math.abs(realMonthly) - value;
      if (Math.abs(diff) < tolerance) break;
      if (diff > 0) low = mid;
      else high = mid;
    }
    return { annualRate: mid, iterations: iteration };
  };

  const handleCalculate = () => {
    const principal = Number(loanAmount);
    const monthly = Number(monthlyPayment) * -1;
    const months = Number(termLength);
    const balloonVal =
      balloonType === "percent" ? (principal * Number(balloonInput)) / 100 : Number(balloonInput);

    if (!calcMethod || !repaymentTiming) {
      alert("Please select a balloon calculation method and repayment timing");
      return;
    }

    const res = findEffectiveRateBinaryBalloon(
      principal,
      Number(fee),
      monthly,
      months,
      balloonVal,
      calcMethod,
      repaymentTiming
    );

    setResult({
      rate: res.annualRate,
      text:
        "If there is a discrepancy please ensure the values are entered correctly. Lenders may not include AKF in their effective interest rate.",
    });
  };

  const defaults = lenderDefaults[lender];
  const calcDisabled = !!defaults.calcMethod;

  return (
    <Paper
      shadow="sm"
      radius="md"
      p="lg"
      withBorder
      style={{
        maxWidth: 650,
        margin: "40px auto",
        background: "#f9f9f9",
      }}
    >
      <Title order={2} ta="center" mb="md">
        Effective Rate Calculator
      </Title>

      <Stack>
        <NumberInput
          label="Loan Amount"
          value={loanAmount}
          onChange={setLoanAmount}
          min={0}
        />

        <NumberInput
          label="Financed Fees (non-recurring)"
          value={fee}
          onChange={setFee}
          min={0}
        />

        <NumberInput
          label="Monthly Payment"
          value={monthlyPayment}
          onChange={setMonthlyPayment}
          min={0}
        />

        <NumberInput
          label="Number of Months"
          value={termLength}
          onChange={setTermLength}
          min={1}
        />

        <Group grow align="end">
          <NumberInput
            label="Balloon"
            value={balloonInput}
            onChange={setBalloonInput}
            min={0}
          />
          <Select
            label="Type"
            value={balloonType}
            onChange={(v) => setBalloonType(v as "dollar" | "percent")}
            data={[
              { value: "dollar", label: "$" },
              { value: "percent", label: "%" },
            ]}
          />
        </Group>

        <Select
          label="Pick Loan Lender"
          placeholder="Select Lender"
          value={lender}
          onChange={(v) => onLenderChange(v as Lender)}
          data={[
            { value: "Westpac", label: "Westpac" },
            { value: "Branded", label: "Branded" },
            { value: "Resimac", label: "Resimac" },
            { value: "Other", label: "Other / Unknown" },
          ]}
        />

        <Select
          label="Balloon Calculation Method"
          placeholder="Select Method"
          value={calcMethod}
          onChange={setCalcMethod}
          disabled={calcDisabled}
          data={[
            { value: "Additional", label: "Paid After the Loan Ends (Extra Month)" },
            { value: "TakesFinal", label: "Reduces Regular Term Length" },
            { value: "OnTop", label: "Paid in Addition to the Last Payment (Extra Amount)" },
          ]}
        />

        <Select
          label="Repayment Timing"
          placeholder="Select Timing"
          value={repaymentTiming}
          onChange={setRepaymentTiming}
          data={[
            { value: "Arrears", label: "Arrears" },
            { value: "Advance", label: "Advance" },
          ]}
        />

        <Button color="blue" onClick={handleCalculate}>
          Calculate
        </Button>

        {result && (
          <Paper mt="md" p="md" shadow="xs" radius="md" withBorder>
            <Text fw={600}>Result</Text>
            <Text>
              <strong>Annual Rate:</strong> {result.rate.toFixed(4)}%
            </Text>
            <Text size="sm" mt="xs" c="dimmed">
              {result.text}
            </Text>
          </Paper>
        )}
      </Stack>
    </Paper>
  );
}
