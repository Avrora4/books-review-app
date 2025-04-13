import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Login } from "./login";
import "@testing-library/jest-dom";

describe('Login Component', () => {
  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('displays error messages when form is submitted with empty fields', async () => {
    render(<Login />);
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByText(/Please Input Email or correct Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Please Input Password/i)).toBeInTheDocument();
  });

  it('updates email and password input values', async () => {
    render(<Login />);
    await userEvent.type(screen.getByLabelText(/email:/i), 'test@example.com');
    expect(screen.getByLabelText(/email:/i)).toHaveValue('test@example.com');
    await userEvent.type(screen.getByLabelText(/password:/i), 'password123');
    expect(screen.getByLabelText(/password:/i)).toHaveValue('password123');
  });
});