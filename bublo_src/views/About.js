import {
  Div,
  H1,
  H2,
  H3,
  H4,
  P,
  Button,
  Span,
  A,
  Section,
  Img,
  Ul,
  Li,
} from "../modules/html.js";
import { useState, useEffect } from "../modules/hooks.js";
import { requests } from "../modules/requests.js";
import MainLayout from "./components/MainLayout.js";

function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const timelineItems = [
    {
      year: "2023",
      title: "The Idea",
      description:
        "Started as a side project to bring React-like features to vanilla JavaScript",
    },
    {
      year: "2024 Q1",
      title: "First Release",
      description:
        "Launched BUBLOJS v1.0 with basic hooks and component system",
    },
    {
      year: "2024 Q2",
      title: "Community Growth",
      description: "Reached 1000+ developers and 500+ projects using BUBLOJS",
    },
    {
      year: "2024 Q3",
      title: "Beta Launch",
      description:
        "Released beta version with advanced features and TypeScript support",
    },
  ];
  return MainLayout(
    // Hero Section
    Section(
      { class: "section" },
      Div(
        { class: "container" },
        Div(
          { class: "text-center mb-16" },
          H1(
            { class: "text-5xl font-bold mb-6" },
            "About ",
            Span({ class: "heading-gradient-purple-pink" }, "BUBLOJS")
          ),
          P(
            { class: "text-xl text-secondary max-w-3xl mx-auto" },
            "BUBLOJS is more than just a framework - it's a philosophy of keeping web development simple, fast, and enjoyable."
          )
        )
      )
    ),

    // Mission Section
    Section(
      { class: "section bg-neutral-50" },
      Div(
        { class: "container" },
        Div(
          { class: "grid grid-2 gap-16 items-center" },
          
          // Mission Content
          Div(
            {},
            H2(
              { class: "text-4xl font-bold mb-6" },
              "Our Mission"
            ),
            P(
              { class: "text-lg text-secondary mb-6" },
              "We believe that modern web development shouldn't require complex build tools, heavy frameworks, or endless configuration. BUBLOJS brings the power of modern JavaScript frameworks to vanilla JavaScript."
            ),
            P(
              { class: "text-secondary mb-8" },
              "Our goal is to make web development accessible, fast, and enjoyable for developers of all skill levels while maintaining the simplicity and performance of vanilla JavaScript."
            ),
            Div(
              { class: "flex gap-4" },
              A(
                { href: requests.url("/docs"), class: "btn btn-gradient btn-lg" },
                "Get Started"
              ),
              A(
                { href: requests.url("/docs"), class: "btn btn-outline btn-lg" },
                "View Documentation"
              )
            )
          ),

          // Mission Visual
          Div(
            { class: "text-center" },
            Div(
              { class: "text-8xl mb-4" },
              "🚀"
            ),
            H3(
              { class: "text-2xl font-bold mb-4" },
              "Simple. Fast. Powerful."
            ),
            P(
              { class: "text-secondary" },
              "Everything you need to build modern web applications without the complexity."
            )
          )
        )
      )
    ),

    // Timeline Section
    Section(
      { class: "section" },
      Div(
        { class: "container" },
        Div(
          { class: "text-center mb-16" },
          H2(
            { class: "text-4xl font-bold mb-6" },
            "Our Journey"
          ),
          P(
            { class: "text-xl text-secondary max-w-2xl mx-auto" },
            "From a simple idea to a thriving community of developers building amazing applications."
          )
        ),

        // Timeline
        Div(
          { class: "max-w-4xl mx-auto" },
          ...timelineItems.map((item, index) =>
            Div(
              { 
                class: `timeline-item ${index % 2 === 0 ? 'timeline-left' : 'timeline-right'} mb-12`
              },
              Div(
                { class: "timeline-content card p-6" },
                Div(
                  { class: "timeline-year text-secondary-600 font-bold text-lg mb-2" },
                  item.year
                ),
                H3(
                  { class: "text-2xl font-bold mb-3" },
                  item.title
                ),
                P(
                  { class: "text-secondary" },
                  item.description
                )
              )
            )
          )
        )
      )
    ),

    // Values Section
    Section(
      { class: "section bg-neutral-50" },
      Div(
        { class: "container" },
        Div(
          { class: "text-center mb-16" },
          H2(
            { class: "text-4xl font-bold mb-6" },
            "Our Values"
          ),
          P(
            { class: "text-xl text-secondary max-w-2xl mx-auto" },
            "The principles that guide everything we do at BUBLOJS."
          )
        ),

        Div(
          { class: "grid grid-3 gap-8" },
          
          // Simplicity
          Div(
            { class: "card text-center" },
            Div(
              { class: "text-5xl mb-4" },
              "🎯"
            ),
            H3(
              { class: "text-2xl font-bold mb-4" },
              "Simplicity"
            ),
            P(
              { class: "text-secondary" },
              "We believe in keeping things simple. No unnecessary complexity, no over-engineering - just clean, readable code that works."
            )
          ),

          // Performance
          Div(
            { class: "card text-center" },
            Div(
              { class: "text-5xl mb-4" },
              "⚡"
            ),
            H3(
              { class: "text-2xl font-bold mb-4" },
              "Performance"
            ),
            P(
              { class: "text-secondary" },
              "Built for speed. Every feature is optimized for performance, ensuring your applications are fast and responsive."
            )
          ),

          // Community
          Div(
            { class: "card text-center" },
            Div(
              { class: "text-5xl mb-4" },
              "🤝"
            ),
            H3(
              { class: "text-2xl font-bold mb-4" },
              "Community"
            ),
            P(
              { class: "text-secondary" },
              "We're building this together. Your feedback, contributions, and ideas help shape the future of BUBLOJS."
            )
          )
        )
      )
    ),

    // Team Section
    Section(
      { class: "section" },
      Div(
        { class: "container" },
        Div(
          { class: "text-center mb-16" },
          H2(
            { class: "text-4xl font-bold mb-6" },
            "Meet the Team"
          ),
          P(
            { class: "text-xl text-secondary max-w-2xl mx-auto" },
            "The passionate developers behind BUBLOJS."
          )
        ),

        Div(
          { class: "grid grid-2 gap-8 max-w-4xl mx-auto" },
          
          // Team Member 1
          Div(
            { class: "card text-center" },
            Div(
              { class: "w-24 h-24 bg-gradient-purple-pink rounded-full mx-auto mb-4 flex items-center justify-center" },
              Span({ class: "text-3xl font-bold text-white" }, "SS")
            ),
            H3(
              { class: "text-xl font-bold mb-2" },
              "Shoaib Shokat"
            ),
            P(
              { class: "text-secondary-600 font-medium mb-2" },
              "Founder & Lead Developer"
            ),
            P(
              { class: "text-secondary text-sm" },
              "Full-stack developer with 8+ years of experience. Passionate about creating tools that make development easier and more enjoyable."
            )
          ),

          // Team Member 2
          Div(
            { class: "card text-center" },
            Div(
              { class: "w-24 h-24 bg-gradient-purple-pink rounded-full mx-auto mb-4 flex items-center justify-center" },
              Span({ class: "text-3xl font-bold text-white" }, "AI")
            ),
            H3(
              { class: "text-xl font-bold mb-2" },
              "AI Assistant"
            ),
            P(
              { class: "text-secondary-600 font-medium mb-2" },
              "Development Partner"
            ),
            P(
              { class: "text-secondary text-sm" },
              "Helping with code implementation, documentation, and bringing innovative ideas to life."
            )
          )
        )
      )
    )
  );
}

export default About;
