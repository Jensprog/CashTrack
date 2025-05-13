import { render, screen } from '@testing-library/react';
import CategoryForm from '../../../src/components/categories/CategoryForm';

const mockOnSubmit = jest.fn();

describe('CategoryForm', () => {
    it ('renders without crashing', () => {
        render(<CategoryForm onSubmit={mockOnSubmit} />);

        expect(screen.getByText(/Kategorityp/i)).toBeInTheDocument();
        expect(screen.getByText(/Kategorinamn/i)).toBeInTheDocument();
    });

    it('displays three category type buttons', () => {
        render(<CategoryForm onSubmit={mockOnSubmit} />);

        expect(screen.getByText(/Inkomst/i)).toBeInTheDocument();
        expect(screen.getByText(/Sparande/i)).toBeInTheDocument();
        expect(screen.getByText(/Utgift/i)).toBeInTheDocument();
    });
});