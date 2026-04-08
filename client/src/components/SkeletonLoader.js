import "../styles/skeleton.css"

export const Skeleton = ({ width = "100%", height = "16px", borderRadius = "6px", style = {} }) => (
  <div className="skeleton-shimmer" style={{ width, height, borderRadius, ...style }} />
)

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-shimmer" style={{ height: "200px", borderRadius: "0" }} />
    <div style={{ padding: "20px" }}>
      <Skeleton width="65%" height="18px" style={{ marginBottom: "10px" }} />
      <Skeleton height="13px" style={{ marginBottom: "8px" }} />
      <Skeleton width="80%" height="13px" />
    </div>
  </div>
)

export const SkeletonAbout = () => (
  <div className="skeleton-about-grid">
    <Skeleton height="400px" borderRadius="12px" />
    <div>
      <Skeleton width="50%" height="20px" style={{ marginBottom: "16px" }} />
      <Skeleton height="14px" style={{ marginBottom: "10px" }} />
      <Skeleton width="90%" height="14px" style={{ marginBottom: "10px" }} />
      <Skeleton width="85%" height="14px" style={{ marginBottom: "10px" }} />
      <Skeleton height="14px" style={{ marginBottom: "10px" }} />
      <Skeleton width="75%" height="14px" style={{ marginBottom: "24px" }} />
      <Skeleton width="150px" height="42px" borderRadius="6px" />
    </div>
  </div>
)

export const SkeletonImpact = () => (
  <div className="skeleton-impact-grid">
    {[1, 2, 3].map((i) => (
      <div key={i} className="skeleton-impact-card">
        <Skeleton width="80px" height="56px" borderRadius="6px" style={{ margin: "0 auto 12px" }} />
        <Skeleton width="70%" height="14px" style={{ margin: "0 auto" }} />
      </div>
    ))}
  </div>
)

export const SkeletonMission = () => (
  <div className="skeleton-mission-grid">
    {[1, 2, 3].map((i) => (
      <div key={i} className="skeleton-mission-card">
        <Skeleton width="40%" height="20px" style={{ marginBottom: "16px" }} />
        <Skeleton height="13px" style={{ marginBottom: "8px" }} />
        <Skeleton width="95%" height="13px" style={{ marginBottom: "8px" }} />
        <Skeleton width="85%" height="13px" style={{ marginBottom: "8px" }} />
        <Skeleton width="70%" height="13px" />
      </div>
    ))}
  </div>
)