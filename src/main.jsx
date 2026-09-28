import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/geist/300.css';
import '@fontsource/geist/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import assets from './assets.json';
import './styles.css';
import './motion.css';
import './responsive.css';
import Testimonials from './Testimonials';
import { usePageMotion } from './Motion';

const asset = (node, name) => '/assets/' + assets[node][name];
const ArrowIcon = ({ className = 'button-arrow', alt = '' }) => <img className={className} src={asset('228:6131', 'imgClarityArrowLine')} alt={alt} aria-hidden={alt ? undefined : true} />;
const links = [['Features', 'features'], ['How it works', 'how-it-works'], ['Testimonials', 'testimonials'], ['FAQ', 'faq']];
const features = [
  { name: 'Groups', title: 'See every goal move forward.', text: 'Create a contribution group, invite your people and see the target, members and next due date in one place.', bullets: ['Group targets and live progress', 'Member contributions in view'], node: '475:14', pattern: 'imgSquigglePatternGroups' },
  { name: 'Wallet', title: 'Add money your way.', text: 'Keep funds ready for your next contribution. The app shows card payment and a personal bank transfer account.', bullets: ['Card and bank transfer options', 'Balance and upcoming dues at a glance'], node: '475:227', pattern: 'imgSquigglePatternWallet' },
  { name: 'Activity', title: 'Everyone stays in the loop.', text: 'Follow payments, group activity and timely reminders without chasing updates in the chat.', bullets: ['Contribution history', 'Due and invitation notifications'], node: '475:381', pattern: 'imgSquigglePatternActivity' },
];
const overview = [
  ['Create a Group', 'Set up your contribution circle in seconds.', 'imgIsoconsGroupRoundedLeft', 'imgIsoconsGroupMobile', 'imgVector31'],
  ['Add Members', 'Invite friends, classmates, or teammates instantly.', 'imgIsoconsPersonAddRoundedLeft', 'imgIsoconsPersonAddMobile', 'imgVector32'],
  ['Track Payments', 'Get reminders, verify payments, and stay organized automatically.', 'imgIsoconsReceiptLongRoundedLeft', 'imgIsoconsReceiptLongMobile', 'imgVector33'],
];
const steps = [
  ['Create your group', 'Set a group name, target and contribution details so everyone knows the plan.'],
  ['Invite your people', 'Add members and bring them into the same contribution circle.'],
  ['Contribute and track', 'See group progress, upcoming dues and activity as the goal moves forward.'],
];
const quotes = [
  ['Tolu Adebayo', 'It helps to see our target and everyone’s contributions in one place.', '#ffc2b0'],
  ['Chidinma Okafor', 'Our trip fund finally has a home beyond the group chat.', '#e3f7b8'],
  ['Farouk Bello', 'Knowing what is due next makes our shared goal feel easier to follow.', '#ffe5a1'],
  ['Amara Eze', 'We can all follow the progress as our goal gets closer.', '#c2e8d6'],
  ['Dami Ogunleye', 'Inviting my people is the first step. Keeping everyone in sync is the good part.', '#c2dbfc'],
  ['Zainab Yusuf', 'I like being able to look back at the contributions and activity.', '#d9c9f7'],
  ['Kemi Adeyemi', 'One shared goal gives our circle something to work towards.', '#ffc9db'],
];
const faqs = [
  ['What can I use Fundora for?', 'Pool contributions with friends, family or groups towards a shared goal, such as a trip, wedding or group project.'],
  ['How do I create a group?', 'Create an account, add your group name, target and contribution details, then invite your people.'],
  ['How can I invite members?', 'Add people during group setup, or open Invite Members in the group details and enter an email or phone number.'],
  ['How do I add money?', 'Fund your wallet using card payment or the bank transfer details shown in the app.'],
  ['Can I see who has contributed?', 'The group view shows member payment status. You can also review contributions in group activity and wallet transactions.'],
  ['When can I download Fundora?', 'Fundora is coming soon. App download links will be added when it launches.'],
];
function Button({ children = 'How it works', href = '#how-it-works', outline = false, arrow = false, className = '' }) {
  return <a className={`button ${outline ? 'outline' : ''} ${className}`} href={href}>{children}{arrow && <ArrowIcon />}</a>;
}
function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);
  const nav = useRef(null);
  useEffect(() => {
    if (!open) return;
    nav.current?.querySelector('a')?.focus();
    const dismiss = event => { if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus(); } };
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, [open]);
  return <header className="header">
    <a className="brand" href="#top" aria-label="Fundora home"><picture><source media="(max-width: 1000px)" srcSet={asset('491:14', 'imgGroup1')} /><img src={asset('228:6131', 'imgGroup1')} alt="" /></picture><span>Fundora</span></a>
    <nav className="desktop-nav" aria-label="Main navigation">{links.map(([text, id]) => <a href={`#${id}`} key={id}>{text}</a>)}</nav>
    <Button className="header-cta" arrow />
    <button className="menu-button" ref={menuButton} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}>
      <span className={`hamburger-icon ${open ? 'is-open' : ''}`} aria-hidden="true"><span /><span /><span /></span>
    </button>
    <nav id="mobile-nav" ref={nav} className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>{links.map(([text, id]) => <a href={`#${id}`} key={id} onClick={() => setOpen(false)}>{text}</a>)}</nav>
  </header>;
}
function App() {
  usePageMotion();
  return <><a href="#features" className="skip-link">Skip to content</a><main id="top">
    <section className="hero" aria-labelledby="hero-title">
      <picture className="hero-pattern"><source media="(max-width: 1000px)" srcSet={asset('491:14', 'imgVector29')} /><img src={asset('228:6131', 'imgVector29')} alt="" /></picture>
      <img className="hero-pattern-bottom" src={asset('228:6131', 'imgVector29')} alt="" />
      <Header />
      <div className="hero-copy"><h1 id="hero-title">Save <em>smarter</em><br />with your people.</h1><p>Fundora keeps your group savings transparent, timely, and easy to manage.</p><div className="hero-actions"><Button arrow /><Button href="#features" outline>Explore features</Button></div></div>
      <img className="hero-phones" src={asset('228:6131', 'imgGroup4273188641')} alt="Fundora app showing contribution groups, your wallet, and a successfully created group" fetchPriority="high" />
    </section>
    <section className="overview container" aria-labelledby="overview-title"><h2 id="overview-title">Everything you need to achieve your group savings</h2><div className="overview-grid">{overview.map(([title, text, icon, mobileIcon, pattern], index) => <article className={`overview-card card-${index}`} key={title}>
      <picture className="overview-pattern"><source media="(max-width: 1000px)" srcSet={asset('491:39', 'imgVector31')} /><img src={asset('249:302', pattern)} alt="" loading="lazy" /></picture>
      <div className="overview-title"><picture className="isocon"><source media="(max-width: 1000px)" srcSet={asset('491:39', mobileIcon)} /><img src={asset('249:302', icon)} alt="" loading="lazy" /></picture><h3>{title}</h3></div><p>{text}</p><Button className="white-button" arrow>Explore steps</Button>
    </article>)}</div></section>
    <section id="features" className="features container" aria-labelledby="features-title"><h2 id="features-title" className="features-title">Key <span className="desktop-label">Features</span><span className="mobile-label">features</span></h2><div className="feature-list">{features.map(feature => <article className={`feature feature-${feature.name.toLowerCase()}`} key={feature.name}>
      <img className="feature-pattern" src={asset(feature.node, feature.pattern)} alt="" loading="lazy" />
      <div className="feature-copy"><p className="eyebrow">FUNDORA / {feature.name.toUpperCase()}</p><h3>{feature.title}</h3><p className="feature-description">{feature.text}</p><ul>{feature.bullets.map(text => <li key={text}>{text}</li>)}</ul></div>
      <picture className="feature-phone"><source media="(max-width: 1000px)" srcSet={`/assets/${feature.name.toLowerCase()}-mobile.png`} /><img src={`/assets/${feature.name.toLowerCase()}.png`} alt={`Fundora ${feature.name.toLowerCase()} screen`} loading="lazy" /></picture>
    </article>)}</div></section>
    <section id="how-it-works" className="how-it-works container" aria-labelledby="how-title"><div className="section-intro"><p className="eyebrow">HOW FUNDORA WORKS</p><h2 id="how-title">One goal. Everyone in sync.</h2><p>A simple flow from the first invite to every contribution.</p></div><div className="step-grid">{steps.map(([title, text], index) => <article className={`step step-${index}`} key={title}><picture className="step-pattern"><source media="(max-width: 1000px)" srcSet={asset('493:14', 'imgVector31')} /><img src={asset('482:14', 'imgSquigglePatternStep')} alt="" loading="lazy" /></picture><span className="step-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <Testimonials quotes={quotes} />
    <section id="faq" className="faq container" aria-labelledby="faq-title"><h2 id="faq-title">Good questions. Clear answers.</h2><p className="faq-intro">A few things to know before your circle gets started.</p><div className="faq-grid">{faqs.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div></section>
    <section className="cta container" aria-labelledby="cta-title"><img className="cta-pattern cta-left" src={asset('475:476', 'imgSquigglePatternCta1')} alt="" loading="lazy" /><picture className="cta-pattern cta-right"><source media="(max-width: 1000px)" srcSet={asset('493:74', 'imgVector31')} /><img src={asset('475:476', 'imgSquigglePatternCta')} alt="" loading="lazy" /></picture><h2 id="cta-title">Fundora is coming soon.</h2><p>Explore how it works today. App download will be available at launch.</p><Button arrow>How it works</Button></section>
  </main><footer className="footer"><picture className="footer-pattern"><source media="(max-width: 1000px)" srcSet={asset('493:81', 'imgVector31')} /><img src={asset('484:21', 'imgSquigglePatternFooter')} alt="" loading="lazy" /></picture><div className="footer-inner"><div className="footer-signoff"><h2>Good things grow<br /><em>together.</em></h2><p>Your people. Your plan.<br />One goal at a time.</p></div><div className="footer-bottom"><a className="footer-brand" href="#top">Fundora</a><nav aria-label="Footer navigation">{links.filter(([, id]) => id !== 'faq').map(([text, id]) => <a href={`#${id}`} key={id}>{text}</a>)}<a className="back-top" href="#top">Back to top <ArrowIcon className="back-top-arrow" /></a><a className="footer-faq" href="#faq">FAQ</a></nav><p className="copyright">© 2026 Fundora</p></div></div></footer></>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
