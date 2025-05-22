function epoch_f_time(epoch_ms, showHours = true, showMinutes = true, showSeconds = true, pad_hours = true, pad_minutes = true) {
    const totalSeconds = Math.floor(epoch_ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    let parts = [];
    if (showHours) {
        const hStr = pad_hours ? h.toString().padStart(2, '0') : h.toString();
        parts.push(hStr);
    }
    if (showMinutes) {
        const mStr = pad_minutes ? m.toString().padStart(2, '0') : m.toString();
        parts.push(mStr);
    }
    if (showSeconds) parts.push(s.toString().padStart(2, '0'));
    return parts.join(':');
}

export default epoch_f_time;