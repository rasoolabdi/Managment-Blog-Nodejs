const commentController = require("../modules/comment/comment.controller");

async function transformPost(post , user) {
    post.likesCount = post.likes.length;
    post.isLike = false;
    post.isBookmarked = false;

    const acceptedComments = await commentController.findAcceptedComments(post._id);
    if(post.author?.avatar) {
        post.author.avatarUrl = `${process.env.SERVER_URL}/${post.author.avatar}`;
    }

    if(post.related.length) {
        post.related = post.related.map((item) => {
            return {
                ...item,
                coverImageUrl: `${process.env.SERVER_URL}/${item.coverImage}`,
                author: {
                    ...item.author,
                    avatarUrl: `${process.env.SERVER_URL}/${item.author.avatar}`
                }
            }
        })
    }

    post.comments = acceptedComments;
    post.commentsCount = acceptedComments.length + acceptedComments.reduce((acc , curr) =>
        acc + curr.answers.length , 0
    );

    if(!user) {
        post.isLike = false;
        post.isBookmarked = false;
        delete post.likes;
        delete post.bookmarks;
        return post;
    }

    if(post.likes.includes(user._id.toString())) {
        post.isLike = true;
    }

    if(post.bookmarks.includes(user._id.toString())) {
        post.isBookmarked = true;
    };

    delete post.bookmarks;
    delete post.likes;
    return post;
};

module.exports = {
    transformPost
};