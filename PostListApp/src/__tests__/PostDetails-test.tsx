import React from 'react';
import { render } from '@testing-library/react-native';
import { useRoute } from '@react-navigation/native';
import { useGetPostCommentsQuery } from '../state/apiSlice';
import PostDetails from '../features/PostDetails';

// Mock the useRoute hook
jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

// Mock the useGetPostCommentsQuery hook
jest.mock('../state/apiSlice', () => ({
  useGetPostCommentsQuery: jest.fn(),
}));

describe('PostDetails', () => {
  const mockRoute = {
    params: {
      postId: 1,
    },
  };

  beforeEach(() => {
    (useRoute as jest.Mock).mockReturnValue(mockRoute);
  });

  it('renders loading state', () => {
    (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    });

    const { getByTestId } = render(<PostDetails />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders error state', () => {
    (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
      data: null,
      error: { message: 'Error fetching comments' },
      isLoading: false,
    });

    const { getByText } = render(<PostDetails />);
    expect(getByText('Error: Error fetching comments')).toBeTruthy();
  });

  it('renders no comments state', () => {
    (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
    });

    const { getByText } = render(<PostDetails />);
    expect(getByText("There aren't any comments at the moment.")).toBeTruthy();
  });

  it('renders comments', () => {
    const comments = [
      { id: 1, name: 'Commenter 1', body: 'This is a comment' },
      { id: 2, name: 'Commenter 2', body: 'This is another comment' },
    ];

    (useGetPostCommentsQuery as jest.Mock).mockReturnValue({
      data: comments,
      error: null,
      isLoading: false,
    });

    const { getByText } = render(<PostDetails />);
    expect(getByText('Comments')).toBeTruthy();
    expect(getByText('Commenter 1')).toBeTruthy();
    expect(getByText('This is a comment')).toBeTruthy();
    expect(getByText('Commenter 2')).toBeTruthy();
    expect(getByText('This is another comment')).toBeTruthy();
  });
});