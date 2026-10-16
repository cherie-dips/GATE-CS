"""Convert MathJax-3 SVG output (with data-mml-node annotations) back into LaTeX.

ExamSIDE renders math server-side to SVG. Every SVG keeps the MathML tree in
`data-mml-node` attributes and each glyph as <use data-c="HEX">, so the original
expression can be rebuilt structurally (fractions, scripts, tables, ...).
"""
import re
import xml.etree.ElementTree as ET

SVGNS = '{http://www.w3.org/2000/svg}'

# ---------------------------------------------------------------- characters
GREEK = {
    'α': r'\alpha', 'β': r'\beta', 'γ': r'\gamma', 'δ': r'\delta', 'ϵ': r'\epsilon', 'ε': r'\varepsilon',
    'ζ': r'\zeta', 'η': r'\eta', 'θ': r'\theta', 'ϑ': r'\vartheta', 'ι': r'\iota', 'κ': r'\kappa',
    'λ': r'\lambda', 'μ': r'\mu', 'ν': r'\nu', 'ξ': r'\xi', 'π': r'\pi', 'ϖ': r'\varpi', 'ρ': r'\rho',
    'ϱ': r'\varrho', 'σ': r'\sigma', 'ς': r'\varsigma', 'τ': r'\tau', 'υ': r'\upsilon', 'ϕ': r'\phi',
    'φ': r'\varphi', 'χ': r'\chi', 'ψ': r'\psi', 'ω': r'\omega',
    'Γ': r'\Gamma', 'Δ': r'\Delta', 'Θ': r'\Theta', 'Λ': r'\Lambda', 'Ξ': r'\Xi', 'Π': r'\Pi',
    'Σ': r'\Sigma', 'Υ': r'\Upsilon', 'Φ': r'\Phi', 'Ψ': r'\Psi', 'Ω': r'\Omega',
}
SYMBOLS = {
    0x2264: r'\le', 0x2265: r'\ge', 0x2212: '-', 0x2217: '*', 0x22C5: r'\cdot', 0xD7: r'\times',
    0xF7: r'\div', 0x2208: r'\in', 0x2209: r'\notin', 0x220B: r'\ni', 0x2286: r'\subseteq', 0x2282: r'\subset',
    0x2287: r'\supseteq', 0x2283: r'\supset', 0x2284: r'\not\subset', 0x2288: r'\nsubseteq', 0x2289: r'\nsupseteq',
    0x228A: r'\subsetneq', 0x228B: r'\supsetneq',
    0x222A: r'\cup', 0x2229: r'\cap', 0x2200: r'\forall', 0x2203: r'\exists', 0x2204: r'\nexists', 0xAC: r'\neg',
    0x2227: r'\wedge', 0x2228: r'\vee', 0x2192: r'\rightarrow', 0x21D2: r'\Rightarrow', 0x2190: r'\leftarrow',
    0x21D0: r'\Leftarrow', 0x2194: r'\leftrightarrow', 0x21D4: r'\Leftrightarrow', 0x2191: r'\uparrow',
    0x2193: r'\downarrow', 0x21A6: r'\mapsto', 0x27F6: r'\longrightarrow', 0x27F9: r'\Longrightarrow',
    0x27FA: r'\Longleftrightarrow', 0x27F7: r'\longleftrightarrow', 0x21A3: r'\rightarrowtail', 0x219B: r'\nrightarrow',
    0x2211: r'\sum', 0x220F: r'\prod', 0x222B: r'\int', 0x222E: r'\oint', 0x221E: r'\infty', 0x2205: r'\emptyset',
    0x2260: r'\ne', 0x2248: r'\approx', 0x2261: r'\equiv', 0x2262: r'\not\equiv', 0x2295: r'\oplus', 0x2296: r'\ominus',
    0x2299: r'\odot', 0x2297: r'\otimes', 0x22A2: r'\vdash', 0x22A8: r'\models', 0x22AC: r'\nvdash', 0x22AD: r'\nvDash',
    0x2032: "'", 0x2033: "''", 0x2026: r'\ldots', 0x22EF: r'\cdots', 0x22EE: r'\vdots', 0x22F1: r'\ddots',
    0x2223: r'\mid', 0x2224: r'\nmid', 0x2225: r'\parallel', 0x230A: r'\lfloor', 0x230B: r'\rfloor', 0x2308: r'\lceil',
    0x2309: r'\rceil', 0x27E8: r'\langle', 0x27E9: r'\rangle', 0x2329: r'\langle', 0x232A: r'\rangle',
    0x2218: r'\circ', 0x2219: r'\bullet', 0x2220: r'\angle', 0x2243: r'\simeq', 0x223C: r'\sim', 0x2245: r'\cong',
    0x226A: r'\ll', 0x226B: r'\gg', 0x2216: r'\setminus', 0x2202: r'\partial', 0x2207: r'\nabla', 0x2213: r'\mp',
    0xB1: r'\pm', 0x22A4: r'\top', 0x22A5: r'\bot', 0x2234: r'\therefore', 0x2235: r'\because', 0x22C0: r'\bigwedge',
    0x22C1: r'\bigvee', 0x22C2: r'\bigcap', 0x22C3: r'\bigcup', 0x2A01: r'\bigoplus', 0x2A02: r'\bigotimes',
    0x2016: r'\|', 0x2229: r'\cap', 0x2227: r'\land', 0x2228: r'\lor', 0x2192: r'\to', 0x22C6: r'\star',
    0x2606: r'\star', 0x25B3: r'\triangle', 0x25A1: r'\Box', 0x25C7: r'\Diamond', 0x2223: '|', 0x2061: '',
    0x2062: '', 0x2063: '', 0x2064: '', 0x200B: '', 0xA0: '~', 0x2003: r'\quad', 0x2002: r'\enspace',
    0x2009: r'\,', 0x2005: r'\;', 0x2004: r'\;', 0x210F: r'\hbar', 0x2113: r'\ell', 0x2118: r'\wp',
    0x211C: r'\Re', 0x2111: r'\Im', 0x2135: r'\aleph', 0x221A: r'\surd', 0x22B2: r'\lhd', 0x22B3: r'\rhd',
    0x22B4: r'\unlhd', 0x22B5: r'\unrhd', 0x228F: r'\sqsubset', 0x2290: r'\sqsupset', 0x2291: r'\sqsubseteq',
    0x2292: r'\sqsupseteq', 0x2294: r'\sqcup', 0x2293: r'\sqcap', 0x22C4: r'\diamond', 0x2240: r'\wr',
    0x226E: r'\nless', 0x226F: r'\ngtr', 0x2270: r'\nleq', 0x2271: r'\ngeq', 0x2272: r'\lesssim',
    0x2273: r'\gtrsim', 0x227A: r'\prec', 0x227B: r'\succ', 0x2AAF: r'\preceq', 0x2AB0: r'\succeq',
    0x2A7D: r'\leqslant', 0x2A7E: r'\geqslant', 0x2266: r'\leqq', 0x2267: r'\geqq', 0x22D8: r'\lll',
    0x22D9: r'\ggg', 0x221D: r'\propto', 0x2201: r'\complement', 0x2210: r'\coprod', 0x2A00: r'\bigodot',
    0x2A04: r'\biguplus', 0x228E: r'\uplus', 0x22BB: r'\veebar', 0x22BC: r'\barwedge', 0x2306: r'\doublebarwedge',
    0x2196: r'\nwarrow', 0x2197: r'\nearrow', 0x2198: r'\searrow', 0x2199: r'\swarrow', 0x21C4: r'\rightleftarrows',
    0x21CC: r'\rightleftharpoons', 0x22A3: r'\dashv', 0x22A6: r'\vdash', 0x22A9: r'\Vdash', 0x2234: r'\therefore',
    0x2032: r"'", 0x2035: r'\backprime', 0x2205: r'\emptyset', 0x2300: r'\varnothing', 0x00B7: r'\cdot',
    0x2022: r'\bullet', 0x2240: r'\wr', 0x00B0: r'^\circ', 0x2103: r'^\circ C', 0x2192: r'\rightarrow',
    0x2015: '-', 0x2014: '-', 0x2013: '-', 0x2010: '-', 0x2011: '-', 0x2212: '-', 0x002D: '-',
    0x27E6: r'[\![', 0x27E7: r']\!]', 0x2758: '|', 0x2502: '|', 0x23D0: '|', 0x2016: r'\|',
    0x231C: r'\ulcorner', 0x231D: r'\urcorner', 0x00AF: r'\bar{}', 0x2C6: r'\hat{}', 0x2DC: r'\tilde{}',
}
SYMBOLS.update({0x2223: '|', 0x22C8: r'\bowtie', 0x27D5: r'\text{⟕}', 0x27D6: r'\text{⟖}', 0x27D7: r'\text{⟗}',
                0x25FB: r'\Box', 0x25A1: r'\Box'})
SPECIAL_ASCII = {'{': r'\{', '}': r'\}', '%': r'\%', '#': r'\#', '&': r'\&', '$': r'\$', '_': r'\_',
                 '\\': r'\backslash', '~': r'\sim', '^': r'\hat{}'}

# pieces of stretchy delimiters -> base delimiter
STRETCH = {}
for cs, base in [((0x23A7, 0x23A8, 0x23A9, 0x23AA), '{'), ((0x23AB, 0x23AC, 0x23AD), '}'),
                 ((0x239B, 0x239C, 0x239D), '('), ((0x239E, 0x239F, 0x23A0), ')'),
                 ((0x23A1, 0x23A2, 0x23A3), '['), ((0x23A4, 0x23A5, 0x23A6), ']'),
                 ((0x23D0, 0x2223, 0x7C, 0x2502), '|'), ((0x2225, 0x2016), '‖'),
                 ((0x2308,), '⌈'), ((0x2309,), '⌉'), ((0x230A,), '⌊'), ((0x230B,), '⌋')]:
    for c in cs:
        STRETCH[c] = base

ACCENTS = {0xAF: r'\bar', 0x2C9: r'\bar', 0x203E: r'\overline', 0x2013: r'\overline', 0x2014: r'\overline',
           0x5E: r'\hat', 0x2C6: r'\hat', 0x302: r'\hat', 0x7E: r'\tilde', 0x2DC: r'\tilde', 0x303: r'\tilde',
           0x2192: r'\vec', 0x20D7: r'\vec', 0x2D9: r'\dot', 0xA8: r'\ddot', 0x2C7: r'\check', 0x2D8: r'\breve',
           0x2CA: r'\acute', 0xB4: r'\acute', 0x2CB: r'\grave', 0x60: r'\grave', 0x23DE: r'\overbrace',
           0x23DF: r'\underbrace', 0x2190: r'\overleftarrow', 0x2194: r'\overleftrightarrow', 0x5F: r'\underline',
           0x332: r'\underline', 0x2212: r'\overline', 0x2D: r'\overline', 0x2015: r'\overline', 0x2500: r'\overline'}

NAMED_FUNCS = {'log', 'ln', 'lg', 'exp', 'sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'max', 'min', 'lim', 'sup',
               'inf', 'det', 'deg', 'gcd', 'dim', 'ker', 'arg', 'Pr', 'mod', 'liminf', 'limsup', 'sinh', 'cosh',
               'tanh', 'arcsin', 'arccos', 'arctan', 'hom', 'lcm'}
BIG_OPS = {r'\sum', r'\prod', r'\int', r'\oint', r'\bigcup', r'\bigcap', r'\bigvee', r'\bigwedge', r'\bigoplus',
           r'\bigotimes', r'\coprod', r'\lim', r'\max', r'\min', r'\sup', r'\inf', r'\limsup', r'\liminf', r'\det',
           r'\gcd', r'\Pr', r'\bigodot', r'\biguplus'}


def math_alnum(cp):
    """Map Mathematical Alphanumeric Symbols back to (ascii char, style) or None."""
    if cp == 0x210E:
        return 'h', 'it'
    blocks = [(0x1D400, 'bf'), (0x1D434, 'it'), (0x1D468, 'bfit'), (0x1D49C, 'cal'), (0x1D4D0, 'bfcal'),
              (0x1D504, 'frak'), (0x1D538, 'bb'), (0x1D56C, 'bffrak'), (0x1D5A0, 'sf'), (0x1D5D4, 'bfsf'),
              (0x1D608, 'sfit'), (0x1D63C, 'bfsfit'), (0x1D670, 'tt')]
    for start, style in blocks:
        if start <= cp < start + 52:
            off = cp - start
            return (chr(ord('A') + off) if off < 26 else chr(ord('a') + off - 26)), style
    if 0x1D7CE <= cp <= 0x1D7FF:
        return str((cp - 0x1D7CE) % 10), 'bf'
    # math italic greek
    if 0x1D6A8 <= cp <= 0x1D7C9:
        greek_up = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡϴΣΤΥΦΧΨΩ∇αβγδεζηθικλμνξοπρςστυφχψω∂ϵϑϰϕϱϖ'
        off = (cp - 0x1D6A8) % 58
        if off < len(greek_up):
            return greek_up[off], 'it'
    letter_like = {0x2102: ('C', 'bb'), 0x210D: ('H', 'bb'), 0x2115: ('N', 'bb'), 0x2119: ('P', 'bb'),
                   0x211A: ('Q', 'bb'), 0x211D: ('R', 'bb'), 0x2124: ('Z', 'bb'), 0x212C: ('B', 'cal'),
                   0x2130: ('E', 'cal'), 0x2131: ('F', 'cal'), 0x210B: ('H', 'cal'), 0x2110: ('I', 'cal'),
                   0x2112: ('L', 'cal'), 0x2133: ('M', 'cal'), 0x211B: ('R', 'cal'), 0x212F: ('e', 'cal')}
    return letter_like.get(cp)


VARIANT_STYLE = {'B': 'bf', 'C': 'cal', 'D': 'bb', 'FR': 'frak', 'SS': 'sf', 'T': 'tt', 'BI': 'bfit',
                 'SSB': 'bfsf', 'SSI': 'sfit', 'SC': 'cal', 'FRB': 'bffrak', 'CB': 'bfcal'}
STYLE_CMD = {'bf': r'\mathbf', 'cal': r'\mathcal', 'bb': r'\mathbb', 'frak': r'\mathfrak', 'sf': r'\mathsf',
             'tt': r'\mathtt', 'bfit': r'\boldsymbol', 'bfsf': r'\mathbf', 'sfit': r'\mathsf',
             'bfcal': r'\mathcal', 'bffrak': r'\mathfrak', 'rm': r'\mathrm', 'bfsfit': r'\boldsymbol'}


def char_tex(cp):
    """Return (tex, style) for a single code point; style in {'it','rm',...} for letters, None otherwise."""
    m = math_alnum(cp)
    if m:
        ch, style = m
        if ch in GREEK:
            return GREEK[ch], None
        return ch, style
    ch = chr(cp)
    if ch in GREEK:
        return GREEK[ch], None
    if cp in SYMBOLS:
        return SYMBOLS[cp], None
    if ch.isascii():
        if ch in SPECIAL_ASCII:
            return SPECIAL_ASCII[ch], None
        if ch.isalpha():
            return ch, 'rm'
        return ch, None
    return ch, None


# ---------------------------------------------------------------- tree helpers

def kind(el):
    k = el.get('data-mml-node')
    if k:
        k = k.replace(' ', '')
    return k


def mml_children(el):
    out = []
    for ch in el:
        tag = ch.tag.replace(SVGNS, '')
        if kind(ch):
            out.append(ch)
        elif tag in ('g', 'svg'):
            out.extend(mml_children(ch))
    return out


def translate_x(el):
    t = el.get('transform') or ''
    m = re.search(r'translate\(\s*([-\d.]+)', t)
    return float(m.group(1)) if m else 0.0


def glyphs(el):
    """Code points (with font variant) and explicit text inside a token element, in order."""
    out = []
    for d in el.iter():
        tag = d.tag.replace(SVGNS, '')
        if tag == 'use':
            c = d.get('data-c')
            href = d.get('{http://www.w3.org/1999/xlink}href') or d.get('href') or ''
            vm = re.search(r'TEX-([A-Z0-9]+)-[0-9A-F]+$', href)
            if c:
                out.append(('c', int(c, 16), vm.group(1) if vm else 'N'))
        elif tag == 'text':
            out.append(('t', d.text or '', d.get('data-variant') or ''))
    return out


def wrap(s):
    s = s.strip()
    if len(s) == 1 or re.fullmatch(r'\\[A-Za-z]+', s):
        return s
    return '{' + s + '}'


def esc_text(s):
    return (s.replace('\\', '\x00').replace('{', r'\{').replace('}', r'\}').replace('%', r'\%')
            .replace('#', r'\#').replace('&', r'\&').replace('$', r'\$').replace('_', r'\_').replace('^', r'\^{}')
            .replace('\x00', r'\textbackslash{}'))


class Conv:
    def __init__(self):
        self.warn = []

    # token -----------------------------------------------------------
    def token(self, el, k):
        gl = glyphs(el)
        if not gl:
            return ''
        if any(g[0] == 't' for g in gl):
            txt = ''.join(g[1] if g[0] == 't' else chr(g[1]) for g in gl)
            if k in ('mi', 'mn') and re.fullmatch(r'[\w.]+', txt):
                return txt if k == 'mn' or len(txt) == 1 else r'\mathrm{' + txt + '}'
            return r'\text{' + esc_text(txt) + '}'
        if k == 'mtext':
            return r'\text{' + esc_text(''.join(chr(g[1]) for g in gl)) + '}'
        # mo: collapse stretchy pieces
        if k == 'mo':
            cps = [g[1] for g in gl]
            if len(cps) > 1 and all(c in STRETCH for c in cps):
                base = STRETCH[cps[0]]
                return self.delim_tex(base)
            if len(cps) > 1 and len(set(cps)) == 1 and cps[0] in (0x2013, 0x2212, 0x2014, 0x2015, 0x2500):
                return '-'
        pieces = []
        letters = []
        styles = set()
        for _, cp, variant in gl:
            tex, style = char_tex(cp)
            vstyle = VARIANT_STYLE.get(variant)
            if style in ('rm', 'it') and vstyle:
                style = vstyle
            if style:
                letters.append(tex)
                styles.add(style)
            pieces.append((tex, style))
        if k == 'mi' and letters and len(letters) == len(pieces):
            word = ''.join(letters)
            st = styles.pop() if len(styles) == 1 else 'it'
            if st == 'rm' and word in NAMED_FUNCS:
                return '\\' + word + ' '
            if st == 'it':
                return word if len(word) == 1 else word
            if st == 'rm':
                return r'\mathrm{' + word + '}'
            return STYLE_CMD.get(st, '') + '{' + word + '}'
        out = []
        for tex, style in pieces:
            if style and style not in ('it', 'rm') and k == 'mi':
                out.append(STYLE_CMD.get(style, '') + '{' + tex + '}')
            elif style == 'rm' and k == 'mi':
                out.append(r'\mathrm{' + tex + '}')
            else:
                out.append(tex)
        s = ''
        for t in out:
            if s and re.search(r'\\[A-Za-z]+$', s) and re.match(r'[A-Za-z]', t):
                s += ' '
            s += t
        if k == 'mo' and len(gl) == 1 and gl[0][2] in ('S3', 'S4', 'S1', 'S2', 'V') and gl[0][1] in STRETCH:
            return self.delim_tex(STRETCH[gl[0][1]])
        return s

    def delim_tex(self, base):
        return {'{': r'\{', '}': r'\}', '|': '|', '‖': r'\|', '⌈': r'\lceil', '⌉': r'\rceil', '⌊': r'\lfloor',
                '⌋': r'\rfloor'}.get(base, base)

    # structural ------------------------------------------------------
    def row(self, kids):
        parts = []
        i = 0
        while i < len(kids):
            k = kind(kids[i])
            if k == 'mspace':
                # sum consecutive mspace widths using sibling offsets
                j = i
                while j < len(kids) and kind(kids[j]) == 'mspace':
                    j += 1
                start = translate_x(kids[i])
                end = translate_x(kids[j]) if j < len(kids) else None
                w = (end - start) if end is not None and end > start else 167 * (j - i)
                if w >= 1800:
                    parts.append(r'\qquad ')
                elif w >= 900:
                    parts.append(r'\quad ')
                elif w >= 400:
                    parts.append(r'\;\; ')
                elif w >= 220:
                    parts.append(r'\; ')
                elif w >= 100:
                    parts.append(r'\, ')
                i = j
                continue
            parts.append(self.node(kids[i]))
            i += 1
        s = ''
        for p in parts:
            if not p:
                continue
            if s and re.search(r'\\[A-Za-z]+$', s) and not re.match(r'[\s{}_^\\]', p):
                s += ' '
            s += p
        s = re.sub(r'\\mathrm\{([^{}]*)\}\\mathrm\{([^{}]*)\}', r'\\mathrm{\1\2}', s)
        return s

    def node(self, el):
        k = kind(el)
        kids = mml_children(el)
        if k in ('mi', 'mn', 'mo', 'mtext', 'ms'):
            return self.token(el, k)
        if k == 'mspace':
            return r'\, '
        if k in ('math', 'mrow', 'TeXAtom', 'mstyle', 'mpadded', 'semantics', 'mfenced', 'menclose', 'inferredMrow'):
            if k == 'mrow' and (el.get('data-mjx-texclass') == 'INNER') and kids and kind(kids[0]) == 'mo':
                return self.leftright(kids)
            if k == 'TeXAtom' and el.get('data-mjx-texclass') == 'OP' and len(kids) == 1 and kind(kids[0]) == 'mi':
                inner = self.node(kids[0]).strip()
                word = re.sub(r'^\\mathrm\{(.*)\}$', r'\1', inner)
                if re.fullmatch(r'[A-Za-z]+', word):
                    return (('\\' + word + ' ') if word in NAMED_FUNCS else r'\operatorname{' + word + '}')
            if k == 'mrow' and kids and kind(kids[0]) == 'mo' and kind(kids[-1]) == 'mo' and len(kids) >= 2:
                first = self.token(kids[0], 'mo')
                gl0 = glyphs(kids[0])
                if gl0 and (len(gl0) > 1 or gl0[0][2] in ('S3', 'S4', 'S1', 'S2', 'V')):
                    return self.leftright(kids)
            return self.row(kids)
        if k == 'mphantom':
            return ''
        if k == 'merror':
            t = ''.join(g[1] for g in glyphs(el) if g[0] == 't')
            self.warn.append('merror')
            return '\x01' + t.strip()
        if k == 'mfrac':
            if len(kids) < 2:
                return self.row(kids)
            bar = any(c.tag.replace(SVGNS, '') == 'rect' for c in el)
            num, den = self.node(kids[0]), self.node(kids[1])
            if not bar:
                return r'\binom{' + num + '}{' + den + '}'
            return r'\frac{' + num + '}{' + den + '}'
        if k == 'msqrt':
            body = [c for c in kids if not self.is_surd(c)]
            return r'\sqrt{' + self.row(body) + '}'
        if k == 'mroot':
            body = [c for c in kids if not self.is_surd(c)]
            if len(body) >= 2:
                return r'\sqrt[' + self.node(body[1]) + ']{' + self.node(body[0]) + '}'
            return r'\sqrt{' + self.row(body) + '}'
        if k in ('msub', 'msup', 'msubsup'):
            if not kids:
                return ''
            base = self.node(kids[0])
            if base.strip() == '':
                base = '{}'
            elif not re.fullmatch(r"[A-Za-z0-9]|\\[A-Za-z]+ ?|\{.*\}|\\[A-Za-z]+\{[^{}]*\}|[)\]|]", base.strip()):
                if kind(kids[0]) in ('mrow', 'TeXAtom') or len(base.strip()) > 1:
                    base = '{' + base + '}'
            scr = kids[1:]
            if k == 'msubsup' and len(scr) >= 2:
                scr = sorted(scr[:2], key=self.translate_y)
            subs = [self.node(c) for c in scr]
            if k == 'msub' and subs:
                return base + '_' + wrap(subs[0])
            if k == 'msup' and subs:
                sup = subs[0].strip()
                if sup in ("'", "''"):
                    return base + sup
                return base + '^' + wrap(sup)
            if k == 'msubsup' and len(subs) >= 2:
                return base + '_' + wrap(subs[0]) + '^' + wrap(subs[1])
            return base
        if k in ('munder', 'mover', 'munderover'):
            if not kids:
                return ''
            base_el = kids[0]
            base = self.node(base_el)
            scripts = kids[1:]
            if k == 'munderover' and len(scripts) >= 2:
                scripts = sorted(scripts[:2], key=self.translate_y)
            if k in ('mover', 'munder') and len(scripts) == 1 and kind(scripts[0]) == 'mo':
                gl = glyphs(scripts[0])
                cps = {g[1] for g in gl}
                if len(cps) == 1:
                    cp = cps.pop()
                    acc = ACCENTS.get(cp)
                    if acc:
                        if k == 'munder':
                            acc = r'\underline' if acc in (r'\overline', r'\bar') else (r'\underbrace' if cp == 0x23DF else r'\underline')
                        elif acc == r'\bar' and len(base.strip()) > 1:
                            acc = r'\overline'
                        return acc + '{' + base + '}'
            if base.strip() in BIG_OPS or base.strip().rstrip() in BIG_OPS or base.strip().startswith('\\lim'):
                b = base.strip()
                if k == 'munder':
                    return b + '_' + wrap(self.node(scripts[0]))
                if k == 'mover':
                    return b + '^' + wrap(self.node(scripts[0]))
                return b + '_' + wrap(self.node(scripts[0])) + '^' + wrap(self.node(scripts[1]))
            if k == 'munder':
                return r'\underset{' + self.node(scripts[0]) + '}{' + base + '}'
            if k == 'mover':
                return r'\overset{' + self.node(scripts[0]) + '}{' + base + '}'
            if len(scripts) >= 2:
                return r'\overset{' + self.node(scripts[1]) + r'}{\underset{' + self.node(scripts[0]) + '}{' + base + '}}'
            return base
        if k == 'mtable':
            return self.table(el, kids)
        if k in ('mtr', 'mlabeledtr', 'mtd'):
            return self.row(kids)
        if k == 'mmultiscripts':
            return self.row(kids)
        self.warn.append('unknown:' + str(k))
        return self.row(kids)

    @staticmethod
    def translate_y(el):
        t = el.get('transform') or ''
        m = re.search(r'translate\(\s*[-\d.]+\s*[, ]\s*([-\d.]+)', t)
        return float(m.group(1)) if m else 0.0

    def is_surd(self, el):
        if kind(el) != 'mo':
            return False
        return any(g[0] == 'c' and g[1] == 0x221A for g in glyphs(el))

    def leftright(self, kids):
        first, last = kids[0], kids[-1]
        lt = self.token(first, 'mo').strip() or '.'
        rt = self.token(last, 'mo').strip() if kind(last) == 'mo' else ''
        inner_kids = kids[1:-1] if kind(last) == 'mo' else kids[1:]
        if kind(last) != 'mo':
            rt = '.'
        rt = rt or '.'
        inner = self.row(inner_kids)
        self._brace = lt == r'\{'
        def fix(d):
            return {'(': '(', ')': ')', '[': '[', ']': ']', '|': '|'}.get(d, d)
        return r'\left' + fix(lt) + ' ' + inner + r' \right' + fix(rt)

    def table(self, el, rows):
        out = []
        ncol = 0
        for r in rows:
            if kind(r) not in ('mtr', 'mlabeledtr'):
                continue
            cells = [c for c in mml_children(r) if kind(c) == 'mtd']
            if kind(r) == 'mlabeledtr' and cells:
                cells = cells[1:] + cells[:1]
            ncol = max(ncol, len(cells))
            out.append(' & '.join(self.row(mml_children(c)) for c in cells))
        align = 'l' * max(ncol, 1)
        return r'\begin{array}{' + align + '}' + r' \\ '.join(out) + r'\end{array}'


def fix_mangled(svg):
    """Some ExamSIDE content had a global 'or' -> ' or ' substitution applied, even inside tags."""
    def fix_tag(m):
        t = m.group(0)
        t = t.replace(' or ', 'or').replace('A to m', 'Atom').replace('" or D"', '"ORD"')
        return t
    return re.sub(r'<[^<>]*>', fix_tag, svg)


def convert(container_html):
    """Return (tex, display, warnings) for one <mjx-container> HTML string."""
    display = 'display="true"' in container_html[:300]
    s = fix_mangled(container_html)
    m = re.search(r'<svg.*</svg>', s, flags=re.S)
    if not m:
        return '', display, ['nosvg']
    svg = m.group(0)
    svg = svg.replace('&nbsp;', ' ')
    try:
        root = ET.fromstring(svg)
    except ET.ParseError as e:
        return '', display, ['parse:' + str(e)]
    mathel = None
    for d in root.iter():
        if kind(d) == 'math':
            mathel = d
            break
    if mathel is None:
        return '', display, ['nomath']
    c = Conv()
    tex = c.node(mathel)
    tex = re.sub(r'[ ]{2,}', ' ', tex).strip()
    return tex, display, c.warn
