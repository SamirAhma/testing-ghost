import React from "react";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";
import Helmet from "react-helmet";

import { readingTime as readingTimeHelper } from "@tryghost/helpers";
import routing from "gatsby-theme-try-ghost/src/utils/routing";

import {
    Layout,
    HeaderPost,
    AuthorList,
    PreviewPosts,
    ImgSharp,
    Comments,
    TableOfContents,
} from "gatsby-theme-try-ghost/src/components/common";
import { StickyNavContainer } from "gatsby-theme-try-ghost/src/components/common/effects";
import { MetaData } from "gatsby-theme-try-ghost/src/components/common/meta";
import { Disqus } from "gatsby-plugin-disqus";
import { PostClass } from "gatsby-theme-try-ghost/src/components/common/helpers";

/**
 * Single post view (/:slug)
 *
 * This file renders a single post and loads all the content.
 *
 */
const Post = ({ data, location, pageContext }) => {
    const post = data.ghostPost;
    const prevPost = data.prev;
    const nextPost = data.next;
    const previewPosts = data.allGhostPost.edges;
    const readingTime = readingTimeHelper(post);
    const featImg = post.feature_image;
    const fluidFeatureImg =
        post.featureImageSharp &&
        post.featureImageSharp.childImageSharp &&
        post.featureImageSharp.childImageSharp.fluid;
    const postClass = PostClass({
        tags: post.tags,
        isFeatured: featImg,
        isImage: featImg && true,
    });

    const primaryTagCount = pageContext.primaryTagCount;
    const transformedHtml = post.childHtmlRehype && post.childHtmlRehype.html;
    const toc =
        (post.childHtmlRehype && post.childHtmlRehype.tableOfContents) || [];
    // console.log(data.ghostPost.childHtmlRehype.html);
    return (
        <>
            <MetaData data={data} location={location} type="article" />
            <Helmet>
                <style type="text/css">{`${post.codeinjection_styles}`}</style>
            </Helmet>
            <StickyNavContainer
                throttle={300}
                isPost={true}
                activeClass="nav-post-title-active"
                render={(sticky) => (
                    <Layout
                        isPost={true}
                        sticky={sticky}
                        header={
                            <HeaderPost sticky={sticky} title={post.title} />
                        }
                        previewPosts={
                            <PreviewPosts
                                posts={previewPosts}
                                primaryTagCount={primaryTagCount}
                                prev={prevPost}
                                next={nextPost}
                            />
                        }
                    >
                        <div className="inner">
                            <article className={`post-full ${postClass}`}>
                                <header className="post-full-header">
                                    {post.primary_tag && (
                                        <section className="post-full-tags">
                                            <Link
                                                to={routing(
                                                    post.primary_tag.url,
                                                    post.primary_tag.slug
                                                )}
                                            >
                                                {post.primary_tag.name}
                                            </Link>
                                        </section>
                                    )}

                                    <h1
                                        ref={sticky && sticky.anchorRef}
                                        className="post-full-title"
                                    >
                                        {post.title}
                                    </h1>

                                    {post.custom_excerpt && (
                                        <p className="post-full-custom-excerpt">
                                            {post.custom_excerpt}
                                        </p>
                                    )}

                                    <div className="post-full-byline">
                                        <section className="post-full-byline-content">
                                            <AuthorList
                                                authors={post.authors}
                                                isPost={true}
                                            />

                                            <section className="post-full-byline-meta">
                                                <h4 className="author-name">
                                                    {post.authors.map(
                                                        (author, i) => (
                                                            <Link
                                                                key={i}
                                                                to={routing(
                                                                    author.url,
                                                                    author.slug
                                                                )}
                                                            >
                                                                {author.name}
                                                            </Link>
                                                        )
                                                    )}
                                                </h4>
                                                <div className="byline-meta-content">
                                                    <time
                                                        className="byline-meta-date"
                                                        dateTime={
                                                            post.published_at
                                                        }
                                                    >
                                                        {
                                                            post.published_at_pretty
                                                        }
                                                        &nbsp;
                                                    </time>
                                                    <span className="byline-reading-time">
                                                        <span className="bull">
                                                            &bull;
                                                        </span>{" "}
                                                        {readingTime}
                                                    </span>
                                                </div>
                                            </section>
                                        </section>
                                    </div>
                                </header>

                                <figure className="post-full-image">
                                    <ImgSharp
                                        fluidClass="kg-card kg-code-card"
                                        fluidImg={fluidFeatureImg}
                                        srcImg={featImg}
                                        title={post.title}
                                    />
                                </figure>

                                <section className="post-full-content">
                                    <TableOfContents
                                        toc={toc}
                                        url={routing(post.url, post.slug)}
                                    />

                                    <div
                                        className="post-content load-external-scripts"
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                transformedHtml || post.html,
                                        }}
                                    />
                                </section>

                                {/* <Comments id={post.id}/> */}
                                <Disqus />
                            </article>
                        </div>
                    </Layout>
                )}
            />
        </>
    );
};

Post.propTypes = {
    data: PropTypes.shape({
        ghostPost: PropTypes.shape({
            codeinjection_styles: PropTypes.string,
            url: PropTypes.string.isRequired,
            slug: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            html: PropTypes.string.isRequired,
            custom_excerpt: PropTypes.string,
            feature_image: PropTypes.string,
            featured: PropTypes.bool,
            tags: PropTypes.arrayOf(PropTypes.object.isRequired),
            authors: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
            primary_tag: PropTypes.shape({
                name: PropTypes.string,
                slug: PropTypes.string.isRequired,
                url: PropTypes.string.isRequired,
            }),
            published_at: PropTypes.string.isRequired,
            published_at_pretty: PropTypes.string.isRequired,
            featureImageSharp: PropTypes.object,
            childHtmlRehype: PropTypes.shape({
                html: PropTypes.string,
                tableOfContents: PropTypes.arrayOf(PropTypes.object),
            }),
        }).isRequired,
        prev: PropTypes.object,
        next: PropTypes.object,
        allGhostPost: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    pageContext: PropTypes.object,
};

export default Post;

export const postQuery = graphql`
    query(
        $slug: String!
        $prev: String!
        $next: String!
        $tag: String!
        $limit: Int!
        $skip: Int!
    ) {
        ghostPost: ghostPost(slug: { eq: $slug }) {
            ...GhostPostFields
        }
        prev: ghostPost(slug: { eq: $prev }) {
            ...GhostPostFields
        }
        next: ghostPost(slug: { eq: $next }) {
            ...GhostPostFields
        }
        allGhostPost(
            sort: { order: DESC, fields: [published_at] }
            filter: {
                slug: { ne: $slug }
                tags: { elemMatch: { slug: { eq: $tag } } }
            }
            limit: $limit
            skip: $skip
        ) {
            edges {
                node {
                    ...GhostPostFields
                }
            }
        }
    }
`;
