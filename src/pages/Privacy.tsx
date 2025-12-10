import { Helmet } from 'react-helmet-async';

const Privacy = () => {
    return (
        <>
            <Helmet>
                <title>Privacy Policy - Learn2Master</title>
            </Helmet>

            <div className="min-h-screen bg-background py-20">
                <div className="container mx-auto px-4 max-w-3xl prose dark:prose-invert">
                    <h1>Privacy Policy</h1>
                    <p className="lead">Last updated: October 2025</p>

                    <p>At Learn2Master, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.</p>

                    <h2>1. Information We Collect</h2>
                    <p>We collect information you provide directly to us, such as when you create an account, update your profile, or contact customer support.</p>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect to provide, maintain, and improve our services, including to personalize your learning experience.</p>

                    <h2>3. Data Protection</h2>
                    <p>We implement a variety of security measures to maintain the safety of your personal information.</p>

                    <h2>4. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at privacy@learn2master.ug.</p>
                    {/* Add more legal text as needed */}
                </div>
            </div>
        </>
    );
};

export default Privacy;
