export default function BrandStory() {
  return (
    <main className="pt-20 overflow-x-hidden">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="glow-orb-pink w-80 h-80 top-0 right-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight via-transparent to-midnight" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <p className="font-mono text-neon-cyan text-xs tracking-[0.3em] uppercase mb-4">The Origin</p>
          <h1 className="font-heading font-black text-5xl sm:text-6xl neon-pink mb-6 uppercase">
            The Evolution<br />of the Edge
          </h1>
        </div>
      </section>

      <section className="py-16 px-4 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="card-dark rounded-sm p-8 md:p-12 space-y-10">
            {[
              {
                title: 'When Steel Whispers, Listen',
                body: `For seventeen years, I lived within the walls of a legend. I began as an apprentice in one of the country's most renowned sharpening houses, learning the old ways under a master recognized across the globe. I gave my loyalty, my labor, and my years to that craft. But eventually, a quiet truth began to whisper from the steel: the standard wasn't enough.`,
              },
              {
                title: 'The Choice: Volume vs. Vision',
                body: `In the world of high-volume sharpening, speed is king. I was told to sharpen faster, to prioritize the clock, and to stick to the rigid methods of the past. But my hands wouldn't listen. I began to develop my own techniques — edges that didn't just meet the standard, but redefined it. Sharper. Longer-lasting. A mirror-like finish the old ways couldn't replicate. When my mentor told me I was "too slow" because I cared too much about the result, I knew I had reached the edge of my known world. I chose to leave the volume behind to pursue the Perfect Edge.`,
              },
              {
                title: 'A Custom Forge for a Custom Result',
                body: `I spent years preparing, building my own sharpening station from the ground up to allow for control and precision that no off-the-shelf machine can match. Industrial-grade abrasives. Custom equipment. The same system I use today. I traded the safety of the institution for the soul of the steel. My accounts included Gary Danko, The French Laundry, Hotel Nikko, Acquerello, Bourbon Steak San Francisco, and many others. The standard was impeccable and universally known.`,
              },
              {
                title: 'The Journey to Miami',
                body: `I have crossed this country to bring this mastery to Miami. I moved here in December 2025 to release seventeen years of stored energy, skill, and accumulated knowledge into a new market — starting from zero. The bootstrapped grind now is the origin story of what comes next. Every knife sharpened in North Miami Beach is a down payment on the compound. I am not here to churn out knives for the masses. I am here for the discerning few — the ones who understand that a tool is an extension of the hand, and that perfection cannot be rushed.`,
              },
            ].map((section, i) => (
              <div key={i}>
                <h2 className="font-heading font-bold text-xl neon-cyan mb-4">{section.title}</h2>
                <p className="font-body text-light/70 leading-relaxed text-lg">{section.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="font-mono text-xs text-muted/50 mb-6 tracking-wider">
              "No mud, no lotus."
            </p>
            <a href="sms:3059095773?body=SHARP" className="btn-primary inline-flex">
              Text SHARP to (305) 909-5773
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
