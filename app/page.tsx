// app/page.tsx

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        background: '#c6f6d5', // light green similar to your wireframe
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        InterGen Skills
      </h1>

      <p style={{ marginBottom: '0.5rem' }}>
        Rohit’s verification backend is running ✅
      </p>

      <p style={{ maxWidth: '40rem' }}>
        You can now build the proper UI to match the wireframe (Home, Login,
        Signup, Edit Profile, Verification, Training, etc.).
      </p>
    </main>
  );
}
