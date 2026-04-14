interface OgTemplateProps {
  title: string;
  description: string;
  category?: string;
}

export function calcOgTemplate({ title, description, category }: OgTemplateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#1565c0',
        padding: '60px 72px',
        fontFamily: 'Inter',
      }}
    >
      {/* Logo row */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'auto' }}>
        <span
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: '-0.3px',
          }}
        >
          CalcEngine
        </span>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 48 }}>
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-1px',
            marginBottom: 24,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: 'rgba(255,255,255,0.78)',
            fontSize: 26,
            lineHeight: 1.45,
            maxWidth: 880,
          }}
        >
          {description}
        </div>
      </div>

      {/* Footer row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex' }}>
          {category ? (
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: 'white',
                fontSize: 20,
                fontWeight: 600,
                padding: '8px 22px',
                borderRadius: 100,
              }}
            >
              {category}
            </div>
          ) : null}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 21 }}>calcengine.dev</div>
      </div>
    </div>
  );
}
