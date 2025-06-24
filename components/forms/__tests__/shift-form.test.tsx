import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { ShiftForm } from "../shift-form"
import "@testing-library/jest-dom"

describe("ShiftForm", () => {
  it("form alanları render edilir ve veri girilebilir", () => {
    const handleSubmit = jest.fn()
    const handleCancel = jest.fn()
    render(<ShiftForm onSubmit={handleSubmit} onCancel={handleCancel} />)

    const employeeNameInput = screen.getByPlaceholderText("Personel adını girin")
    fireEvent.change(employeeNameInput, { target: { value: "Test Personel" } })
    expect(employeeNameInput).toHaveValue("Test Personel")
  })
}) 