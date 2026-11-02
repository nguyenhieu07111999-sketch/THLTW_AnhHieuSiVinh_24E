import os
import re
import html
import zipfile

def markdown_to_html(md_text):
    lines = md_text.split('\n')
    html_lines = []
    
    in_code_block = False
    code_block_lang = ''
    code_lines = []
    
    in_table = False
    table_header_done = False
    
    in_list = False
    list_type = None  # 'ul' or 'ol'
    
    def close_list():
        nonlocal in_list, list_type
        if in_list:
            html_lines.append(f'</{list_type}>')
            in_list = False
            list_type = None
            
    def close_table():
        nonlocal in_table, table_header_done
        if in_table:
            html_lines.append('</tbody></table>')
            in_table = False
            table_header_done = False

    for line in lines:
        stripped = line.strip()
        
        # Check code block fences
        if stripped.startswith('```'):
            if in_code_block:
                # End of code block
                code_content = html.escape('\n'.join(code_lines))
                html_lines.append(f'<pre><code>{code_content}</code></pre>')
                code_lines = []
                in_code_block = False
            else:
                close_list()
                close_table()
                in_code_block = True
                code_block_lang = stripped[3:].strip()
            continue
            
        if in_code_block:
            code_lines.append(line)
            continue
            
        # Check tables
        if stripped.startswith('|') and stripped.endswith('|'):
            close_list()
            # Check if separator row like |:---|:---|
            if re.match(r'^\|(\s*:?-+:?\s*\|)+$', stripped):
                table_header_done = True
                continue
                
            cells = [c.strip() for c in stripped[1:-1].split('|')]
            if not in_table:
                in_table = True
                html_lines.append('<table border="1" cellspacing="0" cellpadding="6"><thead><tr>')
                for c in cells:
                    cell_html = format_inline(c)
                    html_lines.append(f'<th>{cell_html}</th>')
                html_lines.append('</tr></thead><tbody>')
            else:
                html_lines.append('<tr>')
                for c in cells:
                    cell_html = format_inline(c)
                    html_lines.append(f'<td>{cell_html}</td>')
                html_lines.append('</tr>')
            continue
        else:
            close_table()
            
        # Check lists
        ul_match = re.match(r'^[\*\-]\s+(.+)$', stripped)
        ol_match = re.match(r'^\d+\.\s+(.+)$', stripped)
        
        if ul_match:
            close_table()
            if not in_list or list_type != 'ul':
                close_list()
                html_lines.append('<ul>')
                in_list = True
                list_type = 'ul'
            html_lines.append(f'<li>{format_inline(ul_match.group(1))}</li>')
            continue
        elif ol_match:
            close_table()
            if not in_list or list_type != 'ol':
                close_list()
                html_lines.append('<ol>')
                in_list = True
                list_type = 'ol'
            html_lines.append(f'<li>{format_inline(ol_match.group(1))}</li>')
            continue
        else:
            close_list()
            
        # Check headings
        if stripped.startswith('# '):
            html_lines.append(f'<h1>{format_inline(stripped[2:])}</h1>')
            continue
        elif stripped.startswith('## '):
            html_lines.append(f'<h2>{format_inline(stripped[3:])}</h2>')
            continue
        elif stripped.startswith('### '):
            html_lines.append(f'<h3>{format_inline(stripped[4:])}</h3>')
            continue
        elif stripped.startswith('#### '):
            html_lines.append(f'<h4>{format_inline(stripped[5:])}</h4>')
            continue
            
        # Check horizontal rule
        if re.match(r'^-{3,}$', stripped) or re.match(r'^\*{3,}$', stripped):
            html_lines.append('<hr/>')
            continue
            
        # Empty line
        if not stripped:
            continue
            
        # Normal paragraph
        html_lines.append(f'<p>{format_inline(stripped)}</p>')
        
    close_list()
    close_table()
    if in_code_block:
        code_content = html.escape('\n'.join(code_lines))
        html_lines.append(f'<pre><code>{code_content}</code></pre>')
        
    return '\n'.join(html_lines)

def format_inline(text):
    # Escape HTML characters first
    text = html.escape(text)
    
    # Bold **text**
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    
    # Inline code `code`
    text = re.sub(r'`(.+?)`', r'<code>\1</code>', text)
    
    # Links [text](url)
    text = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2" style="color: #047857; text-decoration: underline;">\1</a>', text)
    
    # Arrows
    text = text.replace('-&gt;', '&#8594;').replace('-&gt;&gt;', '&#8658;')
    return text

def create_word_doc(html_content, output_file):
    template = f"""<html xmlns:o='urn:schemas-microsoft-com:office:office' 
xmlns:w='urn:schemas-microsoft-com:office:word' 
xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>Báo Cáo Tổng Hợp Dự Án - FE & BE</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
  <w:View>Print</w:View>
  <w:Zoom>100</w:Zoom>
  <w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml>
<![endif]-->
<style>
  @page Section1 {{
    size: 21.0cm 29.7cm; /* A4 */
    margin: 2.0cm 2.0cm 2.0cm 2.0cm;
    mso-header-margin: 1.0cm;
    mso-footer-margin: 1.0cm;
    mso-paper-source: 0;
  }}
  div.Section1 {{ page: Section1; }}
  body {{
    font-family: 'Times New Roman', 'Segoe UI', Tahoma, serif;
    font-size: 11.5pt;
    line-height: 1.6;
    color: #1f2937;
  }}
  h1 {{
    font-size: 20pt;
    color: #065f46;
    text-align: center;
    margin-top: 15pt;
    margin-bottom: 12pt;
    font-weight: bold;
    border-bottom: 2pt solid #059669;
    padding-bottom: 8pt;
  }}
  h2 {{
    font-size: 15pt;
    color: #047857;
    margin-top: 20pt;
    margin-bottom: 10pt;
    font-weight: bold;
    border-bottom: 1pt solid #cbd5e1;
    padding-bottom: 4pt;
    page-break-after: avoid;
  }}
  h3 {{
    font-size: 13pt;
    color: #0f766e;
    margin-top: 14pt;
    margin-bottom: 6pt;
    font-weight: bold;
    page-break-after: avoid;
  }}
  h4 {{
    font-size: 11.5pt;
    color: #1e293b;
    margin-top: 10pt;
    margin-bottom: 4pt;
    font-weight: bold;
  }}
  p {{
    margin-top: 4pt;
    margin-bottom: 6pt;
    text-align: justify;
  }}
  table {{
    border-collapse: collapse;
    width: 100%;
    margin-top: 10pt;
    margin-bottom: 12pt;
    font-size: 10pt;
  }}
  th {{
    background-color: #ecfdf5;
    color: #065f46;
    font-weight: bold;
    border: 1pt solid #94a3b8;
    padding: 6pt 8pt;
    text-align: left;
  }}
  td {{
    border: 1pt solid #cbd5e1;
    padding: 5pt 8pt;
    vertical-align: top;
  }}
  tr:nth-child(even) td {{
    background-color: #f8fafc;
  }}
  pre {{
    background-color: #f1f5f9;
    border: 1pt solid #cbd5e1;
    border-radius: 4pt;
    padding: 8pt 10pt;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 9.5pt;
    line-height: 1.4;
    margin-top: 6pt;
    margin-bottom: 10pt;
  }}
  code {{
    font-family: 'Consolas', 'Courier New', monospace;
    background-color: #f1f5f9;
    padding: 1pt 3pt;
    border-radius: 3pt;
    font-size: 9.5pt;
    color: #0f766e;
    font-weight: 600;
  }}
  ul, ol {{
    margin-top: 4pt;
    margin-bottom: 6pt;
    padding-left: 20pt;
  }}
  li {{
    margin-bottom: 3pt;
  }}
  hr {{
    border: 0;
    border-top: 1pt solid #cbd5e1;
    margin: 18pt 0;
  }}
</style>
</head>
<body>
<div class="Section1">
{html_content}
</div>
</body>
</html>"""
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(template)

def create_printable_html(html_content, output_file):
    template = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Báo Cáo Tổng Hợp Toàn Bộ Chức Năng & Luồng Mã Nguồn (FE & BE)</title>
<style>
  @media print {{
    @page {{
      size: A4 portrait;
      margin: 1.5cm;
    }}
    .no-print {{
      display: none !important;
    }}
    body {{
      font-size: 10.5pt;
      line-height: 1.5;
    }}
    h1, h2, h3 {{
      page-break-after: avoid;
    }}
    pre, table {{
      page-break-inside: avoid;
    }}
  }}
  body {{
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    background-color: #f8fafc;
    margin: 0;
    padding: 20px;
    line-height: 1.6;
  }}
  .container {{
    max-width: 900px;
    margin: 0 auto;
    background: #ffffff;
    padding: 40px 50px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    border: 1px solid #e2e8f0;
  }}
  .action-bar {{
    position: sticky;
    top: 15px;
    margin-bottom: 25px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    z-index: 100;
  }}
  .btn {{
    padding: 10px 20px;
    background-color: #059669;
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(5,150,105,0.3);
    transition: all 0.2s;
  }}
  .btn:hover {{
    background-color: #047857;
  }}
  h1 {{
    font-size: 24px;
    color: #065f46;
    text-align: center;
    border-bottom: 3px solid #10b981;
    padding-bottom: 15px;
    margin-top: 10px;
  }}
  h2 {{
    font-size: 18px;
    color: #047857;
    margin-top: 30px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 8px;
  }}
  h3 {{
    font-size: 15px;
    color: #0f766e;
    margin-top: 22px;
  }}
  h4 {{
    font-size: 14px;
    color: #334155;
    margin-top: 16px;
  }}
  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 18px 0;
    font-size: 13px;
  }}
  th {{
    background: #ecfdf5;
    color: #065f46;
    padding: 10px 12px;
    border: 1px solid #cbd5e1;
    text-align: left;
  }}
  td {{
    padding: 9px 12px;
    border: 1px solid #cbd5e1;
    vertical-align: top;
  }}
  tr:nth-child(even) td {{
    background-color: #f8fafc;
  }}
  pre {{
    background: #0f172a;
    color: #f8fafc;
    padding: 14px 18px;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.5;
  }}
  code {{
    font-family: 'Consolas', monospace;
    color: #0d9488;
    background: #f1f5f9;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 13px;
  }}
  pre code {{
    color: #f8fafc;
    background: transparent;
    padding: 0;
  }}
  ul, ol {{
    padding-left: 22px;
  }}
  li {{
    margin-bottom: 6px;
  }}
  hr {{
    border: 0;
    height: 1px;
    background: #e2e8f0;
    margin: 30px 0;
  }}
</style>
</head>
<body>
<div class="container">
  <div class="action-bar no-print">
    <button class="btn" onclick="window.print()">🖨️ In ra PDF (Print / Save as PDF)</button>
  </div>
  {html_content}
</div>
</body>
</html>"""
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(template)

def main():
    source_md = r"C:\Users\Anh Hieu\.gemini\antigravity\brain\6eff9aa4-3328-45c7-ab6e-ea42b635fec0\tong-hop-chi-tiet-code-fe-be.md"
    
    if not os.path.exists(source_md):
        print("Source markdown file not found!")
        return

    with open(source_md, 'r', encoding='utf-8') as f:
        md_text = f.read()

    print("Converting Markdown to HTML...")
    html_content = markdown_to_html(md_text)

    # 1. Output Word .doc
    out_word = r"g:\THLTW_AnhHieuSiVinh_24E\BaoCao_TongHop_FE_BE_THLTW.doc"
    create_word_doc(html_content, out_word)
    print(f"Generated Word Document: {out_word}")

    # 2. Output Printable HTML (Save as PDF)
    out_html = r"g:\THLTW_AnhHieuSiVinh_24E\BaoCao_TongHop_FE_BE_THLTW.html"
    create_printable_html(html_content, out_html)
    print(f"Generated Printable Webpage: {out_html}")

if __name__ == "__main__":
    main()

