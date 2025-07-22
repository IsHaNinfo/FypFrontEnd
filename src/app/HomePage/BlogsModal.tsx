import React, { useState, useEffect } from 'react';
import './BlogModal.css';

interface BlogsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Blog {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    author: string;
    source: { name: string };
}

const BlogModal: React.FC<BlogsModalProps> = ({ isOpen, onClose }) => {
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchBlogs();
        }
        // eslint-disable-next-line
    }, [isOpen]);

    const fetchBlogs = async () => {
        try {
            const response = await fetch(
                'https://newsapi.org/v2/everything?q=diabetes&apiKey=cea7f06dca254d1584076a8ff2a7c356'
            );
            const data = await response.json();
            setBlogs(data.articles.slice(0, 6));
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="blog-modal-overlay">
            <div className="blog-modal-content">
                <button className="blog-modal-close" onClick={onClose}>&times;</button>
                <div className="blog-modal-headerbox">
                    <h2 className="blog-modal-header">Latest Diabetic Health Insights</h2>
                    <p className="blog-modal-subtitle">
                        Stay informed with the latest research, lifestyle tips, and expert advice on managing diabetes.
                        Our curated articles help you make informed decisions about your health and well-being.
                    </p>
                </div>
                <div className="blog-modal-list">
                    {blogs.map((blog, index) => (
                        <div className="blog-modal-card" key={index}>
                            <a href={blog.url} target="_blank" rel="noopener noreferrer" className="blog-modal-card-link">
                                <div className="blog-modal-imgbox">
                                    <img
                                        src={blog.urlToImage || "/fallback-img.jpg"}
                                        alt={blog.title}
                                        className="blog-modal-img"
                                    />
                                    <div className="blog-modal-badge">
                                        {new Date(blog.publishedAt).toLocaleDateString()} • {blog.author ? blog.author : blog.source?.name}
                                    </div>
                                </div>
                                <div className="blog-modal-cardbody">
                                    <h3 className="blog-modal-title">{blog.title}</h3>
                                    <p className="blog-modal-desc">{blog.description}</p>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogModal;
