"""
Ingest NCDC curriculum exports (CSV/JSON) and generate a content manifest.

Usage:
    python ingest_ncdc.py --input ./data_exports --output manifest.json

This is a helper script for initial mapping. It expects CSV/JSON files with fields:
 - competency_code, competency_title, indicator_code, indicator_text, subject, level
 - content_id, content_title, content_type, body, media_urls

The script will aggregate competencies and produce a manifest suitable for creating ContentItems.
"""
import argparse
import json
import os
import csv

def ingest_folder(input_folder):
    competencies = {}
    contents = []
    for fn in os.listdir(input_folder):
        path = os.path.join(input_folder, fn)
        if fn.lower().endswith('.csv'):
            with open(path, encoding='utf-8') as fh:
                reader = csv.DictReader(fh)
                for r in reader:
                    comp = r.get('competency_code')
                    if comp:
                        competencies.setdefault(comp, {
                            'code': comp,
                            'title': r.get('competency_title') or '',
                            'indicators': []
                        })
                        ind = r.get('indicator_code') or r.get('indicator')
                        if ind:
                            competencies[comp]['indicators'].append({'code': ind, 'text': r.get('indicator_text')})
                    if r.get('content_id'):
                        contents.append({
                            'id': r.get('content_id'),
                            'title': r.get('content_title'),
                            'type': r.get('content_type') or 'lesson',
                            'body': r.get('body') or '',
                            'media': (r.get('media_urls') or '').split(';') if r.get('media_urls') else []
                        })
        elif fn.lower().endswith('.json'):
            with open(path, encoding='utf-8') as fh:
                data = json.load(fh)
                # expect array of records
                for r in data:
                    comp = r.get('competency_code')
                    if comp:
                        competencies.setdefault(comp, {
                            'code': comp,
                            'title': r.get('competency_title') or '',
                            'indicators': []
                        })
                        ind = r.get('indicator_code') or r.get('indicator')
                        if ind:
                            competencies[comp]['indicators'].append({'code': ind, 'text': r.get('indicator_text')})
                    if r.get('content_id'):
                        contents.append({
                            'id': r.get('content_id'),
                            'title': r.get('content_title'),
                            'type': r.get('content_type') or 'lesson',
                            'body': r.get('body') or '',
                            'media': r.get('media_urls') if isinstance(r.get('media_urls'), list) else (r.get('media_urls') or '').split(';')
                        })

    return {'competencies': list(competencies.values()), 'contents': contents}

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--input', required=True)
    p.add_argument('--output', required=True)
    args = p.parse_args()
    out = ingest_folder(args.input)
    with open(args.output, 'w', encoding='utf-8') as fh:
        json.dump(out, fh, indent=2, ensure_ascii=False)
    print('Manifest written to', args.output)

if __name__ == '__main__':
    main()
