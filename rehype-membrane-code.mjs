// Turns rehype-pretty-code output into the Membrane code block:
//
//   <figure class="mp-code-block" data-theme="dark">
//     <div class="mp-code-block__header"><span>ts</span><button …>copy</button></div>
//     <pre tabindex="0"><code>…</code></pre>
//   </figure>
//
// The block is always dark, so data-theme="dark" lets the ghost copy button and
// the focus ring use their dark-mode tokens. The copy behavior lives in
// BaseLayout (one delegated listener) and confirms with MembranePalette.toast().

const COPY_ICON = {
	type: 'element',
	tagName: 'svg',
	properties: { viewBox: '0 0 24 24', className: ['mp-icon'], ariaHidden: 'true' },
	children: [
		{ type: 'element', tagName: 'rect', properties: { x: '8', y: '8', width: '12', height: '12', rx: '2' }, children: [] },
		{ type: 'element', tagName: 'path', properties: { d: 'M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2' }, children: [] },
	],
};

const LANGUAGE_LABELS = {
	plaintext: 'texto',
	text: 'texto',
	sh: 'shell',
	bash: 'shell',
	zsh: 'shell',
	js: 'javascript',
	ts: 'typescript',
	py: 'python',
	md: 'markdown',
};

function walk(node, visit) {
	visit(node);
	for (const child of node.children ?? []) walk(child, visit);
}

// rehype-pretty-code writes attribute names literally ('data-language'), other
// plugins in hast's camelCase ('dataLanguage'): read either.
function prop(node, name) {
	const props = node?.properties ?? {};
	const camel = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
	return props[name] ?? props[camel];
}

function findChild(node, tagName) {
	return node.children?.find((child) => child.type === 'element' && child.tagName === tagName);
}

export function rehypeMembraneCode() {
	return (tree) => {
		walk(tree, (node) => {
			if (node.type !== 'element' || node.tagName !== 'figure') return;
			if (prop(node, 'data-rehype-pretty-code-figure') === undefined) return;

			const pre = findChild(node, 'pre');
			const code = pre && findChild(pre, 'code');
			if (!pre || !code) return;

			const language = String(prop(code, 'data-language') ?? prop(pre, 'data-language') ?? 'plaintext');
			const label = LANGUAGE_LABELS[language] ?? language;

			// Shiki's theme name lands in data-theme, which Membrane reads as a theme switch.
			delete pre.properties['data-theme'];
			delete code.properties['data-theme'];
			node.properties.className = ['mp-code-block'];
			node.properties.dataTheme = 'dark';
			// A scrolling region must be reachable by keyboard (WCAG 2.1.1).
			pre.properties.tabIndex = 0;
			pre.properties.ariaLabel = `Código ${label}`;

			const header = {
				type: 'element',
				tagName: 'div',
				properties: { className: ['mp-code-block__header'] },
				children: [
					{ type: 'element', tagName: 'span', properties: {}, children: [{ type: 'text', value: label }] },
					{
						type: 'element',
						tagName: 'button',
						properties: {
							type: 'button',
							className: ['mp-button'],
							dataVariant: 'ghost',
							dataSize: 'sm',
							dataIconOnly: '',
							dataCopyCode: '',
							ariaLabel: 'Copiar código',
						},
						children: [COPY_ICON],
					},
				],
			};

			const index = node.children.indexOf(pre);
			node.children.splice(index, 0, header);
		});
	};
}
