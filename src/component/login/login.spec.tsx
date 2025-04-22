import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Login } from "./login";
import "@testing-library/jest-dom";

describe('Login Component', () => {
    beforeEach(() => {
        render(<Login />)
    });

    it('Rendering Test', () => {
        expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });

    it('Email and Password Test', async() => {
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/Email:/i), 'test@example.com');
        expect(screen.getByLabelText(/Email:/i)).toHaveValue('test@example.com');

        await user.type(screen.getByLabelText(/Password:/i), 'password');
        expect(screen.getByLabelText(/Password:/i)).toHaveValue('password');

        });
    it('フォーム送信時にエラーメッセージが表示されること', async () => {
        const user = userEvent.setup();
    
        await user.click(screen.getByRole('button', { name: /Login/i }));
    
        expect(await screen.findByText(/Please Input Email or correct Email/i)).toBeInTheDocument();
        expect(await screen.findByText(/Please Input Password/i)).toBeInTheDocument();
    
        await user.type(screen.getByLabelText(/Email:/i), 'test@example.com');
        await user.click(screen.getByRole('button', { name: /Login/i }));
    
        expect(screen.queryByText(/Please Input Email or correct Email/i)).not.toBeInTheDocument();
        expect(await screen.findByText(/Please Input Password/i)).toBeInTheDocument();
    
        await user.type(screen.getByLabelText(/Password:/i), 'password');
        await user.click(screen.getByRole('button', { name: /Login/i }));
    
        expect(screen.queryByText(/Please Input Email or correct Email/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Please Input Password/i)).not.toBeInTheDocument();
        });
});