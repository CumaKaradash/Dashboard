import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { ProductForm } from "../product-form"
import "@testing-library/jest-dom"

describe("ProductForm", () => {
  it("form alanları render edilir ve veri girilebilir", () => {
    const handleSubmit = jest.fn()
    const handleCancel = jest.fn()
    render(<ProductForm onSubmit={handleSubmit} onCancel={handleCancel} />)

    const nameInput = screen.getByPlaceholderText("Ürün adını girin")
    fireEvent.change(nameInput, { target: { value: "Test Ürün" } })
    expect(nameInput).toHaveValue("Test Ürün")

    const priceInput = screen.getByPlaceholderText("0.00")
    fireEvent.change(priceInput, { target: { value: "123" } })
    expect(priceInput).toHaveValue(123)
  })
}) 