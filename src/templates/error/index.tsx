import React, { ReactChild } from 'react';
import NextHead from 'next/head';
import Link from 'next/link';

import { ErrorType, IRenderError } from '../../error';
import { Footer } from '../homepage/Footer';

import { SlugProperties } from '../../properties';
import { QuickLinks } from './QuickLinks';
import { Title } from './Title';
import { DarkModeToggle } from '../../components/DarkModeToggle';
import { useDebugUrl } from '../../hooks';
import { ExternalLink } from '../../components/Link';

export * from './ErrorBoundary';

const ERROR_TYPES = {
  repo: { title: '404', subtitle: 'Repository Not Found' },
  document: { title: '404', subtitle: 'Document Not Found' },
  page: { title: '404', subtitle: 'Page Not Found' },
  server: { title: '500', subtitle: 'Whoops! Something Went Wrong' },
};

export function Error(error: IRenderError) {
  // let child: React.ReactElement;

  // if (errorType === ErrorType.repositoryNotFound) {
  //   child = <RepositoryNotFound properties={properties} />;
  // } else if (errorType === ErrorType.pageNotFound) {
  //   child = <DocumentNotFound properties={properties} />;
  // } else if (statusCode == 404) {
  //   child = <PageNotFound />;
  // } else {
  //   child = <ServerError properties={properties} />;
  // }

  return (
    <>
      <NextHead>
        <meta key="noindex" name="robots" content="noindex" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet" />
      </NextHead>
      <div className="py-2 bg-gray-800">
        <div className="max-w-4xl mx-auto flex justify-end px-2">
          <DarkModeToggle />
        </div>
      </div>
      <section className="mt-20 max-w-4xl mx-auto px-2">
        <Title statusCode={error.statusCode} />
        <div className="my-16 prose dark:prose-dark prose-lg max-w-none">
          {error.statusCode === 500 && <ServerError {...error} />}
          {error.statusCode !== 500 && <NotFound {...error} />}
        </div>
        <QuickLinks />
        <Footer />
      </section>
    </>
  );
}

export function ServerError({ properties }: IRenderError) {
  const debugUrl = useDebugUrl(properties);

  return (
    <>
      <p>Something went wrong whilst building the page.</p>
      <p>
        The could have happened because of an issue with the remote Markdown content, or something
        internal. To help fix this problem, you can{' '}
        <Link href={debugUrl}>
          <a>debug</a>
        </Link>{' '}
        this page or{' '}
        <ExternalLink href="https://github.com/invertase/docs.page/issues">
          report an issue
        </ExternalLink>
        .
      </p>
    </>
  );
}

export function NotFound({ properties, errorType }: IRenderError) {
  const debugUrl = useDebugUrl(properties);

  if (errorType === ErrorType.repositoryNotFound) {
    return (
      <>
        <p>
          The GitHub repository{' '}
          <ExternalLink href={properties.url}>
            {properties.owner}/{properties.repository}
          </ExternalLink>{' '}
          was not found.
        </p>
        <p>
          To get started, create a new repository on{' '}
          <ExternalLink href="https://github.com/new">GitHub</ExternalLink>. If you were expecting a
          If you were expecting a page to be here, you can{' '}
          <Link href={debugUrl}>
            <a>debug</a>
          </Link>{' '}
          this page or{' '}
          <ExternalLink href="https://github.com/invertase/docs.page/issues">
            report an issue
          </ExternalLink>
          .
        </p>
      </>
    );
  }

  if (errorType === ErrorType.pageNotFound) {
    return (
      <>
        <p>
          No valid file matching the path <code>/{properties.path}</code> could be found.
        </p>
        <p>
          To get started, create a new <code>.md</code> or <code>.mdx</code> you can create a new
          file on{' '}
          <ExternalLink
            href={`https://github.com/${properties.owner}/${properties.repository}/new/${properties.ref}/docs/${properties.path}`}
          >
            GitHub
          </ExternalLink>
          . If you were expecting a page to be here, you can{' '}
          <Link href={debugUrl}>
            <a>debug</a>
          </Link>{' '}
          this page or{' '}
          <ExternalLink href="https://github.com/invertase/docs.page/issues">
            report an issue
          </ExternalLink>
          .
        </p>
      </>
    );
  }

  return null;
}
