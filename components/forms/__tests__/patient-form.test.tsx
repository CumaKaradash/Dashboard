import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { PatientForm } from "../patient-form"
import "@testing-library/jest-dom"

describe("PatientForm", () => {
  it("form alanları render edilir ve veri girilebilir", () => {
    const handleSubmit = jest.fn()
    const handleCancel = jest.fn()
    render(<PatientForm onSubmit={handleSubmit} onCancel={handleCancel} />)

    const firstNameInput = screen.getByPlaceholderText("Ad")
    fireEvent.change(firstNameInput, { target: { value: "Test" } })
    expect(firstNameInput).toHaveValue("Test")

    const lastNameInput = screen.getByPlaceholderText("Soyad")
    fireEvent.change(lastNameInput, { target: { value: "Hasta" } })
    expect(lastNameInput).toHaveValue("Hasta")
  })
}) 