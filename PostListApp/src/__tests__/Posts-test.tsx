import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { useGetPostsQuery } from '../state/apiSlice';
import { useNavigation } from '@react-navigation/native';
import Posts from '../features/Posts';
import { Provider } from 'react-redux';
import {store} from '../state/store';

jest.mock('../state/apiSlice');
jest.mock('@react-navigation/native');

describe('Posts Component', () => {
  const mockNavigate = jest.fn();
  const mockRefetch = jest.fn();

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<Provider store={store}>{component}</Provider>);
  };

  it('renders loading state', () => {
    (useGetPostsQuery as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      refetch: mockRefetch,
    });

    renderWithProvider(<Posts />);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('renders error state', () => {
    (useGetPostsQuery as jest.Mock).mockReturnValue({
      data: null,
      error: { message: 'Failed to fetch' },
      isLoading: false,
      refetch: mockRefetch,
    });

    renderWithProvider(<Posts />);
    expect(screen.getByText('Error: Failed to fetch')).toBeTruthy();
  });

  it('renders list of posts', () => {
    const mockData = [
      { id: 1, title: 'Post 1', body: 'Body 1' },
      { id: 2, title: 'Post 2', body: 'Body 2' },
    ];

    (useGetPostsQuery as jest.Mock).mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
      refetch: mockRefetch,
    });

    renderWithProvider(<Posts />);
    expect(screen.getByText('Post 1')).toBeTruthy();
    expect(screen.getByText('Body 1')).toBeTruthy();
    expect(screen.getByText('Post 2')).toBeTruthy();
    expect(screen.getByText('Body 2')).toBeTruthy();
  });

  it('handles refresh control', () => {
    (useGetPostsQuery as jest.Mock).mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
      refetch: mockRefetch,
    });

    renderWithProvider(<Posts />);
    const refreshControl = screen.getByTestId('refresh-control');
    fireEvent(refreshControl, 'refresh');
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('handles press events on items', () => {
    const mockData = [{ id: 1, title: 'Post 1', body: 'Body 1' }];

    (useGetPostsQuery as jest.Mock).mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
      refetch: mockRefetch,
    });

    renderWithProvider(<Posts />);
    const pressableItem = screen.getByText('Post 1');
    fireEvent.press(pressableItem);
    expect(mockNavigate).toHaveBeenCalledWith('PostDetails', { postId: 1 });
  });
});