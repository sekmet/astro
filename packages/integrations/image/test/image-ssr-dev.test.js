import { expect } from 'chai';
import * as cheerio from 'cheerio';
import { loadFixture } from './test-utils.js';
import testAdapter from '../../../astro/test/test-adapter.js';

describe('SSR images - dev', function () {
	let fixture;
	let devServer;
	let $;

	before(async () => {
		fixture = await loadFixture({
			root: './fixtures/basic-image/',
			adapter: testAdapter(),
			output: 'server',
		});

		devServer = await fixture.startDevServer();
		const html = await fixture.fetch('/').then((res) => res.text());
		$ = cheerio.load(html);
	});

	after(async () => {
		await devServer.stop();
	});

	[
		{
			title: 'Local images',
			id: '#social-jpg',
			url: '/@astroimage/assets/social.jpg',
			query: { f: 'jpg', w: '506', h: '253' },
			contentType: 'image/jpeg',
		},
		{
			title: 'Filename with spaces',
			id: '#spaces',
			url: '/@astroimage/assets/blog/introducing astro.jpg',
			query: { f: 'webp', w: '768', h: '414' },
			contentType: 'image/webp',
		},
		{
			title: 'Inline imports',
			id: '#inline',
			url: '/@astroimage/assets/social.jpg',
			query: { f: 'jpg', w: '506', h: '253' },
			contentType: 'image/jpeg',
		},
		{
			title: 'Remote images',
			id: '#google',
			url: '/_image',
			query: {
				f: 'webp',
				w: '544',
				h: '184',
				href: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
			},
			contentType: 'image/webp',
		},
		{
			title: 'Public images',
			id: '#hero',
			url: '/_image',
			query: {
				f: 'webp',
				w: '768',
				h: '414',
				href: '/hero.jpg',
			},
			contentType: 'image/webp',
		},
	].forEach(({ title, id, url, query, contentType }) => {
		it(title, async () => {
			const image = $(id);

			const src = image.attr('src');
			const [route, params] = src.split('?');

			expect(route).to.equal(url);

			const searchParams = new URLSearchParams(params);

			for (const [key, value] of Object.entries(query)) {
				expect(searchParams.get(key)).to.equal(value);
			}

			const res = await fixture.fetch(image.attr('src'));

			expect(res.status).to.equal(200);
			expect(res.headers.get('Content-Type')).to.equal(contentType);
		});
	});
});

describe('SSR images with subpath - dev', function () {
	let fixture;
	let devServer;
	let $;

	before(async () => {
		fixture = await loadFixture({
			root: './fixtures/basic-image/',
			adapter: testAdapter(),
			output: 'server',
			base: '/docs',
		});

		devServer = await fixture.startDevServer();
		const html = await fixture.fetch('/docs/').then((res) => res.text());
		$ = cheerio.load(html);
	});

	after(async () => {
		await devServer.stop();
	});

	[
		{
			title: 'Local images',
			id: '#social-jpg',
			url: '/@astroimage/assets/social.jpg',
			query: { f: 'jpg', w: '506', h: '253' },
			contentType: 'image/jpeg',
		},
		{
			title: 'Filename with spaces',
			id: '#spaces',
			url: '/@astroimage/assets/blog/introducing astro.jpg',
			query: { f: 'webp', w: '768', h: '414' },
			contentType: 'image/webp',
		},
		{
			title: 'Inline imports',
			id: '#inline',
			url: '/@astroimage/assets/social.jpg',
			query: { f: 'jpg', w: '506', h: '253' },
			contentType: 'image/jpeg',
		},
		{
			title: 'Remote images',
			id: '#google',
			url: '/_image',
			query: {
				f: 'webp',
				w: '544',
				h: '184',
				href: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
			},
			contentType: 'image/webp',
		},
		{
			title: 'Public images',
			id: '#hero',
			url: '/_image',
			query: {
				f: 'webp',
				w: '768',
				h: '414',
				href: '/hero.jpg',
			},
			contentType: 'image/webp',
		},
	].forEach(({ title, id, url, query, contentType }) => {
		it(title, async () => {
			const image = $(id);

			const src = image.attr('src');
			const [route, params] = src.split('?');

			expect(route).to.equal(url);

			const searchParams = new URLSearchParams(params);

			for (const [key, value] of Object.entries(query)) {
				expect(searchParams.get(key)).to.equal(value);
			}

			const res = await fixture.fetch(image.attr('src'));

			expect(res.status).to.equal(200);
			expect(res.headers.get('Content-Type')).to.equal(contentType);
		});
	});
});
