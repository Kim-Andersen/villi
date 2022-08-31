import { Comment, Post, Profile, Vendor } from '../shared/types';

const apiRoot = 'http://localhost:3003';

export async function fetchVendors(): Promise<Vendor[]> {
  const response = await fetch(`${apiRoot}/vendors`);
  if (response.ok) {
    return response.json();
  }
  throw new ApiError(response);
}

export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch(`${apiRoot}/posts`);
  if (response.ok) {
    return response.json();
  }
  throw new ApiError(response);
}

export async function fetchPostComments(post_id: number): Promise<Comment[]> {
  const response = await fetch(`${apiRoot}/posts/${post_id}/comments?&_sort=created_at&_order=asc`);
  if (response.ok) {
    return response.json();
  }
  throw new ApiError(response);
}

export async function fetchProfile(profile_id: number): Promise<Profile> {
  const response = await fetch(`${apiRoot}/profiles/${profile_id}`);
  if (response.ok) {
    return response.json();
  }
  throw new ApiError(response);
}

export class ApiError extends Error {
  constructor(readonly response: Response) {
    super();
    this.handle(response);
  }

  private async handle(response: Response) {
    let json;
    try {
      json = await response.json();
    } catch {}

    this.message = json?.message ?? 'Unknown API error.';
  }
}