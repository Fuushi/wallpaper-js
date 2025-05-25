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

function clientSideDateTimeInterpolater(date_of_issue, value_at_issue) {
    //all values in unix millis (UNTESTED)
    const now = Date.now();
    const elapsedTime = now - date_of_issue;
    const interpolatedValue = value_at_issue + elapsedTime;
    return interpolatedValue;
}

export { epoch_f_time, clientSideDateTimeInterpolater };