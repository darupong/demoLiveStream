// Shared loading, empty, and error screens for list pages. Renders nothing once data is ready.
export function ListState({ state, onRetry, emptyTitle, emptyBody }: { state: string; onRetry: () => void; emptyTitle: string; emptyBody: string }) {
  if (state === 'loading') return <div className="shimmer" style={{ minHeight: 440 }} role="status" aria-label="กำลังโหลดรายการ" />
  if (state === 'error') {
    return (
      <div className="notice">
        <h3>โหลดรายการไม่สำเร็จ</h3>
        <p>ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต แล้วลองอีกครั้ง</p>
        <button className="btn" onClick={onRetry}>ลองอีกครั้ง</button>
      </div>
    )
  }
  if (state === 'empty') {
    return (
      <div className="notice">
        <h3>{emptyTitle}</h3>
        <p>{emptyBody}</p>
      </div>
    )
  }
  return null
}

export const listOptions: [string, string][] = [['ready', 'มีรายการ'], ['loading', 'กำลังโหลด'], ['empty', 'ไม่มีรายการ'], ['error', 'โหลดไม่สำเร็จ']]
