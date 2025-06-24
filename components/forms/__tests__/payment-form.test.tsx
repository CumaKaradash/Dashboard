import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import PaymentForm from "../payment-form"

describe("PaymentForm", () => {
  it("form alanları render edilir ve veri girilebilir", () => {
    const handleSubmit = jest.fn()
    const handleCancel = jest.fn()
    render(<PaymentForm onSubmit={handleSubmit} onCancel={handleCancel} />)

    // Hasta alanı
    const patientInput = screen.getByPlaceholderText("Hasta adı")
    fireEvent.change(patientInput, { target: { value: "Test Hasta" } })
    expect(patientInput).toHaveValue("Test Hasta")

    // Tutar alanı
    const amountInput = screen.getByPlaceholderText("350")
    fireEvent.change(amountInput, { target: { value: "123" } })
    expect(amountInput).toHaveValue(123)
  })
}) 