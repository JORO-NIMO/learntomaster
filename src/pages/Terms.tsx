import { Helmet } from 'react-helmet-async';

const Terms = () => {
    return (
        <>
            <Helmet>
                <title>Terms of Service - Learn2Master</title>
            </Helmet>

            <div className="min-h-screen bg-background py-20">
                <div className="container mx-auto px-4 max-w-3xl prose dark:prose-invert">
                    <h1>Terms of Service</h1>
                    <p className="lead">Last updated: October 2025</p>

                    <p>Please read these Terms of Service carefully before using the Learn2Master platform.</p>

                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing or using our service, you agree to be bound by these Terms.</p>

                    <h2>2. Use License</h2>
                    <p>Permission is granted to temporarily download one copy of the materials (information or software) on Learn2Master's website for personal, non-commercial transitory viewing only.</p>

                    <h2>3. Disclaimer</h2>
                    <p>The materials on Learn2Master's website are provided on an 'as is' basis.</p>

                    {/* Add more legal text as needed */}
                </div>
            </div>
        </>
    );
};

export default Terms;
