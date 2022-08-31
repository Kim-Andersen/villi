
const casual = require('casual');
const photos = require('./lib/photos');
const { getRandomArrayIndex } = require('./lib/utils');

module.exports = () => {
  const tags = ['bio', 'farm', 'self-service', 'fooling-around', 'local', 'produce', 'market'];
  const profiles = createProfiles(10);
  const posts = createPosts({ profiles, photos, tags });
  const comments = createComments({ posts, profiles });
  const vendors = createVendors({ photos, tags });
  const feed = createFeed();

  posts.forEach(post => {
    post.comment_count = comments.filter(c => c.post_id === post.id).length;
  });

  return { 
    profiles,
    posts,
    comments,
    vendors,
    feed
  }
}

function createProfiles(length) {
  return Array.from(Array(length).keys()).map(index => ({
    id: index + 1, 
    full_name: casual.full_name,
    email: casual.email.toLowerCase(),
    profile_pic: `https://randomuser.me/api/portraits/${index < length / 2 ? 'women' : 'men'}/${index+1}.jpg`
  }));
}

/**
 * @param {Object} options 
 * @param {Array} options.profiles
 * @param {Array} options.photos
 * @param {Array} options.tags
 */
function createPosts({ profiles, photos, tags }) {
  const year = (new Date).getFullYear();

  return profiles.map((profile, i) => ({
    id: i+1, 
    profile_id: profile.id,
    profile_pic: profile.profile_pic,
    full_name: profile.full_name,
    created_at: casual.moment.set('year', year).toDate(),
    caption: casual.sentences(n = 2),
    photos: i < photos.length -1 ? photos.slice(i, i+1) : photos.slice(0,1),
    tags: tags.sort(() => Math.random() - Math.random()).slice(0, Math.floor(tags.length / 2))
  }));
}

/**
 * @param {Object} options 
 * @param {Array} options.posts
 * @param {Array} options.profiles
 */
 function createComments({ posts, profiles }) {
  const comments = [];
  let commentId = 1;

  posts.forEach(post => {
    // Random number of random profiles.
    const randomProfiles = profiles.slice(getRandomArrayIndex(profiles)).sort(() => 0.5 - Math.random());
    randomProfiles.forEach((profile, index) => {
      comments.push({
        id: commentId,
        post_id: post.id,
        created_at: new Date(new Date(post.created_at).getTime() + (1000*60*60) + (index * 1000)), // +1 hour from post.created_at.
        profile_id: profile.id,
        profile_pic: profile.profile_pic,
        full_name: profile.full_name,
        text: casual.sentences(n = 2)
      });
      commentId++;
    });
  });

  return comments;
}

function createVendors({ photos, tags }) {
  return Array.from({ length: 30 }).map((photo, i) => ({
    id: i+1,
    name: casual.company_name,
    description: casual.description,
    email: casual.email.toLowerCase(),
    phone: casual.phone,
    website_url: casual.url.toLowerCase(),
    tags: tags.sort(() => Math.random() - Math.random()).slice(0, Math.floor(tags.length / 2)),
    photos: photos.sort(() => Math.random() - Math.random()).slice(0, Math.floor(photos.length / 3)),
    locations: [
      {
        id: i+1,
        type: 'outlet',
        description: casual.description,
        city: casual.city,
        postal_code: casual.integer(from = 1000, to = 9000),
        street: casual.street,
        street_number: casual.building_number,
        location: [casual.latitude, casual.longitude]
      }
    ]
  }));
}

function createFeed() {
  return [];
}

