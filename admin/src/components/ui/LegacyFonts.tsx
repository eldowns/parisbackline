// Bebas Neue + Inter for the admin portal and original landing page. The public site
// self-hosts its own face, so these stay off its critical rendering path.
export default function LegacyFonts() {
  return <>
    <link rel="preconnect" href="https://fonts.bunny.net" />
    <link rel="stylesheet" href="https://fonts.bunny.net/css?family=bebas-neue:400|inter:300,400,500,600,700&display=swap" precedence="default" />
  </>;
}
