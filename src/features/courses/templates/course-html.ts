export function buildCourseHtml(
  title: string,
  instructorName: string,
  description: string,
  colors: {
    background: string;
    primary: string;
    backgroundElement: string;
    text: string;
    textSecondary: string;
    backgroundSelected: string;
  }
) {
  const isDark = colors.background === "#000000";
  const bg = isDark ? "#121212" : "#F9FAFB";
  const cardBg = isDark ? "#1E1E1E" : "#FFFFFF";
  const text = colors.text;
  const textSecondary = colors.textSecondary;
  const primary = colors.primary;
  const border = colors.backgroundSelected;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: ${bg};
            color: ${text};
            margin: 0;
            padding: 16px;
          }
          .card {
            background-color: ${cardBg};
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 1px solid ${border};
          }
          h1 {
            font-size: 22px;
            font-weight: 800;
            margin-top: 0;
            margin-bottom: 8px;
            line-height: 1.3;
          }
          .subtitle {
            color: ${textSecondary};
            font-size: 14px;
            margin-bottom: 16px;
          }
          .section-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: ${primary};
          }
          .desc {
            font-size: 14px;
            line-height: 1.6;
            color: ${textSecondary};
            margin-bottom: 0;
          }
          .syllabus-item {
            display: flex;
            align-items: center;
            padding: 12px;
            border-bottom: 1px solid ${border};
          }
          .syllabus-item:last-child {
            border-bottom: none;
          }
          .syllabus-item input {
            margin-right: 12px;
            width: 18px;
            height: 18px;
            accent-color: ${primary};
          }
          .syllabus-label {
            font-size: 14px;
            font-weight: 500;
          }
          .progress-container {
            margin-top: 20px;
          }
          .progress-bar-bg {
            background-color: ${border};
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 8px;
          }
          .progress-bar-fill {
            background-color: ${primary};
            height: 100%;
            width: 0%;
            transition: width 0.3s ease;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>${title || "Course Material"}</h1>
          <div class="subtitle">Instructor: ${instructorName || "Expert"}</div>
          <p class="desc">${description || "No description provided."}</p>
        </div>

        <div class="card">
          <div class="section-title">Syllabus & Progress</div>
          <div class="syllabus-item">
            <input type="checkbox" id="m1" onclick="updateProgress()">
            <label for="m1" class="syllabus-label">Module 1: Introduction</label>
          </div>
          <div class="syllabus-item">
            <input type="checkbox" id="m2" onclick="updateProgress()">
            <label for="m2" class="syllabus-label">Module 2: Core Fundamentals</label>
          </div>
          <div class="syllabus-item">
            <input type="checkbox" id="m3" onclick="updateProgress()">
            <label for="m3" class="syllabus-label">Module 3: Advanced Concepts</label>
          </div>
          <div class="syllabus-item">
            <input type="checkbox" id="m4" onclick="updateProgress()">
            <label for="m4" class="syllabus-label">Module 4: Real-world Applications</label>
          </div>

          <div class="progress-container">
            <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600;">
              <span>Completion Status</span>
              <span id="prog-pct">0%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" id="fill"></div>
            </div>
          </div>
        </div>

        <script>
          function updateProgress() {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            const checkedCount = Array.from(checkboxes).filter(c => c.checked).length;
            const percent = Math.round((checkedCount / checkboxes.length) * 100);
            
            document.getElementById('prog-pct').innerText = percent + '%';
            document.getElementById('fill').style.width = percent + '%';
          }
        </script>
      </body>
    </html>
  `;
}
