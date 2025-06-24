import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { SessionForm } from "../session-form"
import "@testing-library/jest-dom"

describe("SessionForm", () => {
  it("form alanları render edilir ve veri girilebilir", () => {
    const handleSubmit = jest.fn()
    const handleCancel = jest.fn()
    render(<SessionForm onSubmit={handleSubmit} onCancel={handleCancel} />)

    const notesInput = screen.getByPlaceholderText("Seans sırasında yapılan gözlemler, hasta tepkileri, önemli konular...")
    fireEvent.change(notesInput, { target: { value: "Test Not" } })
    expect(notesInput).toHaveValue("Test Not")
  })
}) 