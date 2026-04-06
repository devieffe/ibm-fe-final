import img1 from '../assets/images/img1.png'
import img2 from '../assets/images/img2.png'
import img3 from '../assets/images/img3.png'
import img4 from '../assets/images/img4.png'

const posts = [
    {
        title: 'Nutrition Essentials',
        text: 'Learn how to create balanced meals and keep your energy levels high throughout the day.',
        image: img1,
        alt: 'Nutrition Essentials',
    },
    {
        title: 'Wellness Habits',
        text: 'Small daily habits can make a big difference in your overall health and mindset.',
        image: img2,
        alt: 'Wellness Habits',
    },
    {
        title: 'Fitness Routines',
        text: 'Find effective workout plans for beginners and experienced users alike.',
        image: img3,
        alt: 'Fitness Routines',
    },
    {
        title: 'Mindfulness Tips',
        text: 'Build resilience and reduce stress with practical mindfulness techniques.',
        image: img4,
        alt: 'Mindfulness Tips',
    },
    {
        title: 'Sleep & Recovery',
        text: 'Understand why quality sleep is the foundation of good health and how to improve your nightly rest.',
        image: img1,
        alt: 'Sleep and Recovery',
    },
    {
        title: 'Healthy Hydration',
        text: 'Discover how staying properly hydrated throughout the day boosts energy, focus, and physical performance.',
        image: img2,
        alt: 'Healthy Hydration',
    },
]

export default function HealthBlogPage() {
    return (
        <>
            <div className="container mt-4">
                <div className="hero">
                    <h1>Health blog</h1>
                    <p>Discover wellness tips, healthy recipes, and expert advice on staying fit and happy.</p>
                </div>
            </div>

            <div className="container mt-4">
                <div className="mt-4">
                    {posts.map((post) => (
                        <div className="card post-card mb-4" key={post.title}>
                            <div className="row g-0 align-items-center">
                                <div className="col-md-4">
                                    <img src={post.image} alt={post.alt} className="img-fluid post-card-img" />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5>{post.title}</h5>
                                        <p>{post.text}</p>
                                        <a href="#" className="stretched-link">Read more</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
